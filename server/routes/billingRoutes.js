const capitalizeFirstLetter = require('../utils/capitalizeFirstLetter');

const keys = require('../config/keys');
const stripe = require('stripe')(keys.stripeSecretKey);
var mailgun = require('mailgun-js')({
  apiKey: keys.mailgunAPIKey,
  domain: keys.mailgunDomain
});
const requireLogin = require('../middlewares/requireLogin');
const deepMerge = require('deepmerge');

const mongoose = require('mongoose');
const Asso = mongoose.model('assos');
const User = mongoose.model('users');
const Family = mongoose.model('families');

const validateCharge = require('../utils/validateCharge');

module.exports = app => {
  app.post('/api/payment', requireLogin, async (req, res) => {
    let family; // this will contain the family data, after pulling it from database

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // Save the raw user input into database, for future reference
    // userInput is all of req.body without req.body.stripeToken
    const userInput = {
      // stripeTokenId: req.body.stripeToken ? req.body.stripeToken.id : null,
      paymentOption: req.body.paymentOption,
      installmentsQuantity: req.body.installmentsQuantity,
      familyId: req.body.familyId,
      eventId: req.body.eventId,
      validKids: req.body.validKids,
      validParents: req.body.validParents,
      validAddresses: req.body.validAddresses,
      validMedia: req.body.validMedia,
      validFamilyById: req.body.validFamilyById,
      validChecked: req.body.validChecked,
      photoConsent: req.body.photoConsent,
      total: req.body.total,
      timestamp: Date.now()
    };
    // console.log(
    //   'billingRoutes, 43, userInput.stripeTokenId: ',
    //   userInput.stripeTokenId
    // );

    const inputHistoryNewCount = req.user.inputsHistory.push(userInput); // NB we won't use this const

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // TODO .trim() on familyNames and firstNames

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // rename the variables from frontend, for clarity:
    const familyId = req.user.familyId,
      stripeTokenId = req.body.stripeToken ? req.body.stripeToken.id : null,
      primaryEmail = req.user.primaryEmail,
      paymentOption = req.body.paymentOption,
      installmentsQuantity = req.body.installmentsQuantity,
      frontendEventId = req.body.eventId,
      frontendAllKids = req.body.validKids,
      frontendAllParents = req.body.validParents,
      frontendAllParentsAndKids = frontendAllKids.concat(frontendAllParents),
      frontendAddresses = req.body.validAddresses,
      frontendMedia = req.body.validMedia,
      frontendFamilyById = req.body.validFamilyById,
      frontendTotal = req.body.total,
      frontendPhotoConsent = req.body.photoConsent,
      frontendChecked = req.body.validChecked,
      frontendCharge = {
        frontendAllKids,
        frontendAllParents,
        frontendMedia,
        frontendFamilyById,
        frontendTotal,
        frontendChecked
      };

    console.log('billingroutes.js, 78, stripeTokenId: ', stripeTokenId);

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // look up the event details, from backend database
    // TODO I shouldn't be looking up this data again, I already did it in authRoutes (get)!

    let thisAsso;
    try {
      thisAsso = await Asso.findOne({ id: 'a0' });
    } catch (error) {
      console.log(
        'familyId: ',
        familyId,
        '. billingRoutes.js // line 61 // error: ',
        error
      );
    }

    const assoName = thisAsso.name;
    const thisEvent = thisAsso.eventsById.e0;
    // TODO e0 is hardcoded!
    const previousRegistered = thisAsso.registrations;
    const {
      eventId,
      eventName,
      discountedPrices,
      standardPrices
    } = thisAsso.eventsById.e0;

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // ######## form validation ########
    // TODO move this to a middleware
    // TODO validation: are these validChecked items really part of this event?
    // TODO validation: for each of these, validate the file type (boolean, string, etc)
    // TODO validation: is the user authorized to register this eventId? Is this
    // eventId currently open for registration?
    // check that the charge request received from frontend is valid

    const { chargeErrors, applyDiscount } = validateCharge({
      familyId,
      frontendCharge,
      thisEvent
    });

    if (chargeErrors.length) {
      res.status(500).send({
        error:
          'There was something wrong with the data received from the form, so we cancelled the payment.'
      });
      // NB this custom error text is actually not shown in my client app
    } else {
      let validatedTotal = frontendTotal;
      // ######## end of form validation ########

      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      // TODO change from real data delete to just `delete` flag
      // "Delete" (= set `deleted` flag to `true`) kids and parents in the
      // `users` collection, who have been deleted as per frontend form. For
      // this, compare what IDs are missing in the new
      // `frontendAllParentsAndKids` compared to the old
      // `allKids + allParents from family collection`.
      if (req.user.allKids && req.user.allParents) {
        // if this is the first creation of kids and parents for this family,
        // then the previous allKids and allParents are undefined, and for sure
        // there is no record to delete.
        const previousParentsAndKids = req.user.allKids.concat(
          req.user.allParents
        );
        const droppedParentsAndKids = previousParentsAndKids.filter(
          userId => !frontendAllParentsAndKids.includes(userId)
        );
        // droppedParentsAndKids.map(userId => {
        //   let deletedOne = User.findOneAndDelete({ id: userId });
        //   console.log('deletedOne: ', deletedOne);
        // });
        // User.findOneAndDelete({id: { $in: droppedParentsAndKids }});
        User.deleteMany({ id: { $in: droppedParentsAndKids } }, function(err) {
          if (err) {
            console.log('familyId: ', familyId, '. error by deleteMany: ', err);
          }
          // else {
          // console.log('deleteMany succeeded.');
          // }
        });
      }

      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      // save updated profile (familyMedia, addresses, allKids, allParents,
      // photoConsent, registeredEvents) from frontend into `family` collection :

      // registeredEvents are the eventIds (e.g. ['e0'])
      let previousRegisteredEvents = req.user.registeredEvents;
      let newRegisteredEvents = previousRegisteredEvents.concat([
        frontendEventId
      ]);

      req.user.registeredEvents = newRegisteredEvents;
      req.user.allKids = frontendAllKids;
      req.user.allParents = frontendAllParents;
      req.user.addresses = frontendAddresses;
      req.user.familyMedia = frontendMedia;
      req.user.photoConsent = frontendPhotoConsent;

      // console.log('x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-');
      // console.log('frontendPhotoConsent: ', frontendPhotoConsent);
      try {
        family = await req.user.save();
        //TODO rename family to thisFamily to ease search per keyword in code
      } catch (error) {
        res.status(500).json({ error: error.toString() });
        console.log(
          'familyId: ',
          familyId,
          '. billingRoutes.js, line 144: error by saving frontend info into family collection',
          error
        );
      }

      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      // save new users (kids and parents) from frontend into
      // `users` collection (firstName, familyName and kidGrade):
      frontendAllParentsAndKids.map(async userId => {
        const newUserData = frontendFamilyById[userId];
        let newOrUpdatedUser;

        let existingUser;
        try {
          existingUser = await User.findOne({ id: userId });
        } catch (error) {
          console.log(
            'familyId: ',
            familyId,
            '. billingRoutes.js // line 163 // error by findOne: ',
            error
          );
        }

        if (existingUser) {
          // console.log('found existing user: ', newUserData.firstName);
          try {
            newOrUpdatedUser = await existingUser.set(newUserData);
          } catch (error) {
            console.log(
              'familyId: ',
              familyId,
              '. error by replacing old data: ',
              error
            );
          }
        } else {
          // console.log('creating new user: ', newUserData.firstName);
          try {
            newOrUpdatedUser = await new User(newUserData).save();
          } catch (error) {
            console.log(
              'familyId: ',
              familyId,
              '. error by creating new user: ',
              error
            );
          }
        }
        newOrUpdatedUser.save();
        // console.log('newOrUpdatedUser: ', newOrUpdatedUser);
      });

      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      // execute the payment
      // console.log('billingRoutes, 244, testing paymentOption: ', paymentOption);

      let stripeReceipt;
      if (paymentOption === 'creditCard') {
        const chargeDescription =
          assoName + '-' + eventName + '-' + primaryEmail;
        try {
          console.log('billingRoutes, 250, creating Stripe Charge');
          stripeReceipt = await stripe.charges.create({
            amount: validatedTotal,
            currency: 'eur',
            description: chargeDescription,
            source: stripeTokenId
          });
          console.log(
            'billingRoutes, 257, stripeReceipt.id: ',
            stripeReceipt.id
          );
        } catch (error) {
          'familyId: ',
            familyId,
            console.log('. Error while connecting to Stripe server: ', error);
        }

        // console.log('billingRoutes, 264, stripeReceipt.id: ', stripeReceipt.id);

        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        // save stripeCharge receipt into this `family` collection, in database,
        // for future reference:
        const ReceiptsCount = req.user.paymentReceipts.push(stripeReceipt); // NB we won't use this const
        console.log('billingRoutes, 270, ReceiptsCount: ', ReceiptsCount);
        console.log('billingRoutes, 283, stripeReceipt.id: ', stripeReceipt.id);
        try {
          family = await req.user.save();
        } catch (error) {
          console.log(
            'familyId: ',
            familyId,
            '. Error while saving stripeCharge to database: ',
            error
          );
        }
      }

      console.log('billingRoutes, 283, stripeReceipt: ', stripeReceipt);

      if (
        (paymentOption === 'creditCard' &&
          stripeReceipt.status === 'succeeded') ||
        paymentOption === 'bankTransfer' ||
        paymentOption === 'moneyCheque'
      ) {
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        // save the paid classes into the `registrations` property of `asso`

        // TODO in case of error inside this 'succeeded' loop, the risk is that
        // a parent has paid, but the classes don't get recorded in his profile.
        // Should automatically either save the classes later, either inform the admin!

        // console.log('--------------------------------------');
        // console.log('stripeReceipt.status: ', stripeReceipt.status);

        const arrayMerge = (arr1, arr2) => [...new Set(arr1.concat(arr2))];
        // arrayMerge defines how the deepMerge shall proceed with arrays:
        // concatenate and remove the duplicates.

        let newRegistered = deepMerge(previousRegistered, frontendChecked, {
          arrayMerge
        });

        // console.log('previousRegistered: ', previousRegistered);
        // console.log('frontendChecked: ', frontendChecked);
        // console.log('newRegistered: ', newRegistered);

        try {
          thisAsso = await Asso.findOne({ id: 'a0' });
        } catch (error) {
          console.log(
            'familyId: ',
            familyId,
            '. billingRoutes.js, line 267 // error by findOne Asso: ',
            error
          );
        }

        try {
          updatedAsso = await thisAsso.set({
            registrations: newRegistered
          });
        } catch (error) {
          console.log(
            'familyId: ',
            familyId,
            '. billingRoutes.js, line 281 // error by saving newRegistered: ',
            error
          );
        }

        try {
          updatedAsso.save();
        } catch (error) {
          console.log(
            'familyId: ',
            familyId,
            '. billingRoutes.js, line 292, error by saving modified asso to db: ',
            error
          );
        }

        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        // // double checking if really saved:
        // let newAsso;
        // try {
        //   newAsso = await Asso.findOne({ id: 'a0' });
        // } catch (error) {
        //   console.log(
        //     'billingRoutes.js, line 185 // error by findOne Asso: ',
        //     error
        //   );
        // }
        // newAssoRegistrations = newAsso.registrations;
        // // here I would need some comparison with the data from frontend.
        // // For now only a manual check in the console
        // console.log('newAssoRegistrations: ', newAssoRegistrations);
        // console.log('--------------------------------------------');

        // TODO is it ok to close the `if` loop in next row???!
      }

      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      // build receipt data out of stripeReceipt and database data
      // TODO beware that from here on `stripeReceipt.status` can be 'succeeded' or not
      const allKidsAndParents = [].concat(family.allKids, family.allParents);
      const allKidsFamilyParents = [familyId].concat(allKidsAndParents);
      try {
        family = await Family.findOne({ familyId });
      } catch (error) {
        console.log(
          '. billingRoutes.js, line 329, error by Family.findOne: ',
          error
        );
      }

      // TODO rename users (the extract from database) to usersArray, to avoid mix up format (array vs object)
      try {
        users = await User.find({
          id: { $in: allKidsAndParents }
          // [{id, firstName, familyName, kidGrade},{},...]
        });
      } catch (error) {
        console.log(
          '. billingRoutes.js, line 341, error by User.find: ',
          error
        );
      }
      const normalizedUsers = users.reduce((obj, thisUser) => {
        obj[thisUser.id] = thisUser;
        return obj;
      }, {});

      // TODO add familyId to the normalizedUsers, to avoid bug when looking up info about the familyItems

      // console.log('users: ', users);
      // console.log('normalizedUsers: ', normalizedUsers);
      // normalized state

      // TODO try get registrations directly through a (nested) database query
      // const registrations = await Asso.find({
      //   userId: { $in: allKidsAndParents }
      // });
      const applicablePrice = ({
        itemId,
        discountedPrices,
        standardPrices,
        applyDiscount
      }) => (applyDiscount ? discountedPrices[itemId] : standardPrices[itemId]);

      try {
        thisAsso = await Asso.findOne({ id: 'a0' });
      } catch (error) {
        console.log(
          '. billingRoutes.js, line 367, error by pulling asso from database: ',
          error
        );
      }

      // the classes that have been booked by this family, so far
      const familyRegistrations = allKidsFamilyParents.map(userId => ({
        [userId]: thisAsso.registrations[userId]
      }));

      const itemBeneficiaries = ({ itemId, frontendChecked }) =>
        Object.keys(frontendChecked).filter(userId =>
          frontendChecked[userId].includes(itemId)
        );

      const allPurchasedItems = [
        ...new Set([].concat(...Object.values(frontendChecked)))
      ] // extract all the itemIds from frontendChecked, without duplicates
        .sort((i0, i1) => i0.substring(1) - i1.substring(1)); // sort, ascending, based on the digits in itemId

      purchasedItemsById = allPurchasedItems
        .map(itemId => thisAsso.itemsById[itemId]) // for each of these itemIds,
        // get the item object, here as array of objects.
        .reduce((obj, item) => {
          obj[item.id] = {
            id: item.id,
            name: item.name,
            period: item.period,
            paidPrice: applicablePrice({
              itemId: item.id,
              discountedPrices,
              standardPrices,
              applyDiscount
            }),
            beneficiaries: itemBeneficiaries({
              itemId: item.id,
              frontendChecked
            })
          };
          return obj;
        }, {});
      // convert this array to a normalized object, keeping only the useful properties

      const purchasedVolunteeringItems = thisEvent.volunteeringItems.filter(
        itemId => allPurchasedItems.includes(itemId)
      );
      const purchasedClassItems = thisEvent.classItems.filter(itemId =>
        allPurchasedItems.includes(itemId)
      );

      // extract the family names of all parents from the profile form, filter out
      // doublons, then concatenate string with '-' in between.
      // function capitalizeFirstLetter(thisString) {
      //   return thisString.charAt(0).toUpperCase() + thisString.slice(1);
      // }
      const mergedFamilyName = [
        ...new Set(
          family.allParents.map(thisParentId =>
            capitalizeFirstLetter(normalizedUsers[thisParentId].familyName)
          )
        )
      ].join('-');
      // console.log('mergedFamilyName: ', mergedFamilyName);

      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      // one receipt is sent to fontEnd (publicReceipt)
      // one receipt is sent per email (emailBody / emailData)
      // one receipt is saved to database

      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      // put together the publicReceipt
      // TODO all the data in publicReceipt should be pulled from the database,
      // not from the request data, otherwise it will be wrong whenever there was
      // an erorr during database writing.
      const paymentReference = (
        eventId +
        '-' +
        familyId.slice(0, 4) +
        '-' +
        familyId.slice(4, 8)
      ).toUpperCase();

      let publicReceipt = {
        paymentOption,
        assoName: thisAsso.name,
        mergedFamilyName,
        familyId,
        users: normalizedUsers, // [{firstName, familyName, kidGrade},{},...]
        allKids: family.allKids,
        allParents: family.allParents,
        addresses: family.addresses,
        primaryEmail,
        familyMedia: family.familyMedia,
        photoConsent: family.photoConsent,
        eventName,
        paymentOption,
        paymentReference,
        datesToPay: thisEvent.installmentDates,
        bankReference: thisAsso.bankReference[0],
        installmentsQuantity:
          paymentOption !== 'creditCard' ? thisEvent.installments * 1 : 1,
        chequeOrder: thisAsso.chequeOrder,
        chequeCollection: thisAsso.chequeCollection,
        total: validatedTotal,
        livemode:
          paymentOption === 'creditCard' ? stripeReceipt.livemode : null,
        timeStamp:
          paymentOption === 'creditCard' ? stripeReceipt.created : null,
        currency:
          paymentOption === 'creditCard' ? stripeReceipt.currency : null,
        last4:
          paymentOption === 'creditCard' ? stripeReceipt.source.last4 : null,
        status: paymentOption === 'creditCard' ? stripeReceipt.status : null,
        chargeId: paymentOption === 'creditCard' ? stripeReceipt.id : null,
        familyRegistrations, // purchased in this order or BEFORE
        applyDiscount,
        allPurchasedItems, // purchased in THIS purchase order // TODO copy to family database with date of purchase, for archive
        purchasedVolunteeringItems,
        purchasedClassItems,
        purchasedItemsById, // purchased in THIS purchase order
        registeredEvents: newRegisteredEvents
      };
      // console.log('publicReceipt: ', publicReceipt);
      // TODO include eventual error messages in the publicReceipt

      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      // send confirmation email to primaryEmail and to backupEmail

      const FullTextKidsNames = publicReceipt.allKids
        .map(
          kidId =>
            capitalizeFirstLetter(publicReceipt.users[kidId].firstName) +
            ' ' +
            publicReceipt.users[kidId].familyName.toUpperCase()
        )
        .join(' & ');

      const paymentDatesString = publicReceipt.datesToPay
        .map(
          timeStamp =>
            '            ' +
            new Date(timeStamp * 1).toLocaleDateString('en-US', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            })
        )
        .join('\n');

      const email_Volunteering =
        '# Volunteering # \n\n' +
        (publicReceipt.purchasedVolunteeringItems.length > 0
          ? 'I volunteer to help with following activities:\n' +
            publicReceipt.purchasedVolunteeringItems
              .map(
                itemId => '- ' + publicReceipt.purchasedItemsById[itemId].name
              )
              .join('\n')
          : 'I choose not to volunteer to assist with any activities at this time.') +
        '\n\n';

      const email_Closing =
        '- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -\n';

      // prettier-ignore
      const email_Greetings =
        'Dear ' + capitalizeFirstLetter(
          publicReceipt.users[publicReceipt.allParents[0]].firstName) + ',\n\n' +
        'thank you for your ' +
        (paymentOption === 'creditCard' ? '' : 'pre-') + 'registration to ' +
        thisAsso.name + '!\n' +
        'You find below a summary of the information you submitted. ' +
        'Please contact us if you notice any error.\n\n';

      // prettier-ignore
      const email_PaymentInstructions =
        paymentOption !== 'creditCard' ?
            'To complete this registration, please proceed with the payment, ' +
            'either per cheque, either per bank transfer:\n\n' +
            'Per cheque: \n' +
            '    - 3 cheques of ' + Math.ceil(publicReceipt.total / 300) + ' EUR each,\n' +
            '         to be dropped in the mailbox of ' + thisAsso.name + ',\n' +
            '         and that will be cashed on:\n' + paymentDatesString + '\n' +
            '      or 1 cheque only of ' + Math.ceil(publicReceipt.total / 100) + 'EUR,\n' +
            '    - to the order of: ' + thisAsso.name + '.\n' +
            '    - Object (important!): ' + paymentReference + '.\n\n' +
            'Per bank transfer: \n' +
            '    - 3 payments of ' + Math.ceil(publicReceipt.total / 300) + ' EUR each,\n' +
            '      or 1 payment only of ' + Math.ceil(publicReceipt.total / 100) + '\n' +
            '    - IBAN: ' + thisAsso.bankReference[0].IBAN + '\n' +
            '    - BIC: ' + thisAsso.bankReference[0].BIC + '\n' +
            '    - Name of the bank: ' + thisAsso.bankReference[0].BankName + '\n' +
            '    - Account owner: ' + thisAsso.name + '\n' +
            '    - Reference to write (important!): ' + paymentReference + '\n' +
            '    - Deadlines for the transfers:\n' + paymentDatesString + '\n\n'
          : '';

      // prettier-ignore
      const email_CreditCardReceipt =
        paymentOption === 'creditCard'
          ? '# Payment receipt #\n\n' +
            '- Receipt No.: ' + publicReceipt.chargeId + '\n' +
            '- Credit card number: xxxx xxxx xxxx ' + publicReceipt.last4 + '\n' +
            '- Total paid: ' + publicReceipt.total / 100 + ' EUR \n' +
            '- Payment status: ' + publicReceipt.status + '\n' +
            '- Time: ' + new Date(1000 * publicReceipt.timeStamp).toLocaleString() + '\n\n'
          : '';

      const email_Regards = 'Kind Regards,\n' + 'Jerome\n\n';

      // prettier-ignore
      const email_AssoHeader =
        '- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -\n' +
        thisAsso.name + '\n' +
        thisAsso.address + '\n' +
        'Association registered at the prefecture under number ' +
        thisAsso.referenceNumbers.SIRETnumber + '\n\n' +
        thisEvent.eventName + '\n\n';

      const email_Profile =
        '# Profile #\n\n' +
        '## Children ##\n\n' +
        publicReceipt.allKids
          .map(
            kidId =>
              '- ' +
              capitalizeFirstLetter(publicReceipt.users[kidId].firstName) +
              ' ' +
              publicReceipt.users[kidId].familyName.toUpperCase() +
              ', ' +
              publicReceipt.users[kidId].kidGrade
          )
          .join('\n') +
        '\n\n' +
        '## Parents ##\n\n' +
        publicReceipt.allParents
          .map(
            parentId =>
              '- ' +
              capitalizeFirstLetter(publicReceipt.users[parentId].firstName) +
              ' ' +
              publicReceipt.users[parentId].familyName.toUpperCase()
          )
          .join('\n') +
        '\n\n' +
        '## Phones, emails, post addresses ##\n\n' +
        '- Primary email: ' +
        publicReceipt.primaryEmail +
        '\n' +
        publicReceipt.familyMedia
          .map(
            media =>
              '- ' +
              media.media +
              ' (' +
              media.tags.join(', ') +
              '): ' +
              media.value +
              '\n'
          )
          .join() +
        publicReceipt.addresses
          .map(
            address =>
              '- address (' + address.tags.join(', ') + '): ' + address.value
          )
          .join('\n') +
        '\n\n';

      const email_SelectedClasses =
        '# Selected classes # \n\n' +
        publicReceipt.purchasedClassItems
          .map(
            itemId =>
              '- ' +
              publicReceipt.purchasedItemsById[itemId].name +
              ', ' +
              publicReceipt.purchasedItemsById[itemId].period +
              ', for ' +
              publicReceipt.purchasedItemsById[itemId].beneficiaries
                .map(
                  userId =>
                    userId === publicReceipt.familyId
                      ? 'the whole family'
                      : capitalizeFirstLetter(
                          publicReceipt.users[userId].firstName
                        )
                )
                .join(' & ') +
              '. Unit price: ' +
              publicReceipt.purchasedItemsById[itemId].paidPrice / 100 +
              ' EUR.'
          )
          .join('\n') +
        '\n\n';

      const email_PhotoConsent =
        '# Photo & Video Consent # \n\n' +
        (publicReceipt.photoConsent
          ? 'I give permission to ' +
            thisAsso.name +
            ' to take photographs and videos of my child(ren) ' +
            FullTextKidsNames +
            ', and I grant ' +
            thisAsso.name +
            ' the full rights to use the images resulting from the photography ' +
            'and video filming, and any reproductions or ' +
            'adaptations of the images for fundraising, publicity or other ' +
            "purposes to help achieve the association's aims. This might include " +
            '(but is not limited to) the right to use them in their printed and ' +
            'online newsletters, websites, publicities, social media, press ' +
            'releases and funding applications'
          : "I don't give permission to " +
            thisAsso.name +
            ' to take photographs and videos of my child(ren) ' +
            FullTextKidsNames) +
        '.\nSignature: ' +
        capitalizeFirstLetter(
          publicReceipt.users[publicReceipt.allParents[0]].firstName
        ) +
        ' ' +
        publicReceipt.users[
          publicReceipt.allParents[0]
        ].familyName.toUpperCase() +
        '\n\n';

      const email_Text =
        email_Greetings +
        email_PaymentInstructions +
        email_Regards +
        email_AssoHeader +
        email_CreditCardReceipt +
        email_Profile +
        email_SelectedClasses +
        email_PhotoConsent +
        email_Volunteering +
        email_Closing;

      const email_Subject =
        (publicReceipt.livemode ? '' : 'TEST / ') +
        thisAsso.name +
        ' / ' +
        mergedFamilyName +
        ' / ' +
        {
          moneyCheque: 'Registration (payment required)',
          bankTransfer: 'Registration (payment required)',
          creditCard: 'Confirmation of registration'
        }[paymentOption];

      const email_Data = {
        from: thisAsso.emailFrom,
        to: primaryEmail,
        cc: thisAsso.backupEmail,
        'h:Reply-To': thisAsso.replyTo,
        subject: email_Subject,
        text: email_Text
      };

      try {
        mailgun.messages().send(email_Data, function(error, body) {
          if (error) {
            console.log('billingRoutes, 591. ERROR: ', error);
            res.status(500).json({ error: error.toString() });
          } else {
            console.log(
              'Confirmation of registration has been sent to: ',
              primaryEmail
            );
            // send the payment receipt to front end:
            res.status(200).send(publicReceipt);
          }
        });
      } catch (error) {
        console.log('billingRoutes, 604. ERROR: ', error);
        res.status(500).json({
          error: error.toString(),
          receipt: publicReceipt,
          bookedEvents: ['e0'] // TODO for bookedEvents, should add this event
          // to the previous state (pulled from database) of the array,
          // and store into database
        });
      }
    }
  });
};

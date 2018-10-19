const router = require('express').Router();

const capitalizeFirstLetter = require('../../utils/capitalizeFirstLetter');
const validateCharge = require('../../utils/validateCharge');
const requireLogin = require('../../middlewares/requireLogin');
const keys = require('../../config/keys');
const stripe = require('stripe')(keys.stripeSecretKey);
const wrapAsync = require('../../utils/wrapAsync');
const deepMerge = require('deepmerge');
const mongoose = require('mongoose');
const Asso = mongoose.model('assos');
const User = mongoose.model('users');
const Family = mongoose.model('families');
const sendEmail = require('../../utils/sendEmail');

const buildEmailData = require('../../utils/buildEmailData_Payment')
  .buildEmailData;

router.post(
  '/',
  requireLogin,
  wrapAsync(async (req, res) => {
    let family; // this will contain the family data, after pulling it from database

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // saveUserInput();
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

    // console.log('billingroutes.js, 78, stripeTokenId: ', stripeTokenId);

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
        // console.log('billingRoutes, 270, ReceiptsCount: ', ReceiptsCount);
        // console.log('billingRoutes, 283, stripeReceipt.id: ', stripeReceipt.id);
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

      // console.log('billingRoutes, 283, stripeReceipt: ', stripeReceipt);

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
        bookedEvents: ['e0'], // TODO for bookedEvents, should add this event
        // to the previous state (pulled from database) of the array,
        // and store into database
        paymentOption,
        assoName: thisAsso.name,
        assoAddress: thisAsso.address,
        assoReferenceNumbers: thisAsso.referenceNumbers,
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

      const emailData = buildEmailData(publicReceipt, thisAsso);
      const sentEmailData = await sendEmail(emailData);

      console.log(
        '%s, %s: REGISTRATION CONFIRMATION sent to %s and %s. Payment option: %s',
        req.ip,
        primaryEmail,
        sentEmailData.to,
        sentEmailData.cc,
        sentEmailData.frontEndData.paymentOption
      );

      res.status(200).send(publicReceipt);
    }
  })
);

module.exports = router;

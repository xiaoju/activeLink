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

const paymentReceiptDraft = require('../models/paymentReceiptDraft');
const validateCharge = require('../utils/validateCharge');

module.exports = app => {
  app.post('/api/payment', requireLogin, async (req, res) => {
    let family; // this will contain the family data, after pulling it from database

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // rename the variables from frontend, for clarity:
    const familyId = req.user.familyId,
      primaryEmail = req.user.primaryEmail,
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

    const thisEvent = thisAsso.eventsById.e0;
    const previousRegistered = thisAsso.registrations;
    const {
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
      // execute the paiement
      const chargeDescription =
        req.body.familyId + '-' + req.body.eventId + '-';
      // TODO add the name of the association
      // and use the full text name of the eventId
      // and user the mergedFamilyName
      let stripeReceipt;
      try {
        stripeReceipt = await stripe.charges.create({
          amount: frontendTotal,
          currency: 'eur',
          description: chargeDescription,
          source: req.body.stripeToken.id
        });
      } catch (error) {
        'familyId: ',
          familyId,
          console.log('. Error while connecting to Stripe server: ', error);
      }

      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      // save stripeCharge receipt into this `family` collection, in database,
      // for future reference:
      const ReceiptsCount = req.user.paymentReceipts.push(stripeReceipt); // NB we won't use this const
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

      if (stripeReceipt.status === 'succeeded') {
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

      console.log('users: ', users);
      console.log('normalizedUsers: ', normalizedUsers);
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

      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      // put together the publicReceipt
      // TODO all the data in publicReceipt should be pulled from the database,
      // not from the request data, otherwise it will be wrong whenever there was
      // an erorr during database writing.
      let publicReceipt = {
        assoName: thisAsso.name,
        familyId,
        users: normalizedUsers, // [{firstName, familyName, kidGrade},{},...]
        allKids: family.allKids,
        allParents: family.allParents,
        addresses: family.addresses,
        primaryEmail,
        familyMedia: family.familyMedia,
        photoConsent: family.photoConsent,
        eventName,
        total: stripeReceipt.amount,
        timeStamp: stripeReceipt.created,
        currency: stripeReceipt.currency,
        last4: stripeReceipt.source.last4,
        status: stripeReceipt.status,
        chargeId: stripeReceipt.id,
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

      const emailBody =
        'Hello,\n\n' +
        'please find below your confirmation of registration.\n' +
        'Please contact us if you notice any error.\n\n' +
        'Kind Regards,\n' +
        'Jerome\n\n' +
        '- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -\n' +
        thisAsso.name +
        ', ' +
        thisEvent.eventName +
        '\n\n' +
        '# Paiement receipt #\n\n' +
        '- Receipt No.: ' +
        publicReceipt.chargeId +
        '\n' +
        '- Credit card number: xxxx xxxx xxxx ' +
        publicReceipt.last4 +
        '\n' +
        '- Total paid: ' +
        publicReceipt.total / 100 +
        ' EUR \n' +
        '- Payment status: ' +
        publicReceipt.status +
        '\n' +
        '- Time: ' +
        new Date(1000 * publicReceipt.timeStamp).toLocaleString() +
        '\n\n' +
        '# Profile #\n\n' +
        '## Children ##\n\n' +
        publicReceipt.allKids
          .map(
            kidId =>
              '- ' +
              publicReceipt.users[kidId].firstName +
              ' ' +
              publicReceipt.users[kidId].familyName +
              ', ' +
              publicReceipt.users[kidId].kidGrade
          )
          .join('\n') +
        '\n\n' +
        '## Parents ##\n\n' +
        publicReceipt.allParents.map(
          parentId =>
            '- ' +
            publicReceipt.users[parentId].firstName +
            ' ' +
            publicReceipt.users[parentId].familyName +
            '\n'
        ) +
        '\n' +
        '## Phones & Emails ##\n\n' +
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
              '- address (' +
              address.tags.join(', ') +
              '): ' +
              address.value +
              '\n'
          )
          .join() +
        '\n # Selected classes # \n\n' +
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
                      : publicReceipt.users[userId].firstName
                )
                .join(' & ') +
              '. Unit price: ' +
              publicReceipt.purchasedItemsById[itemId].paidPrice / 100 +
              ' EUR.'
          )
          .join('\n') +
        '\n\n' +
        '# Photo & Video Consent # \n\n' +
        (publicReceipt.photoConsent
          ? 'I give permission to ' +
            thisAsso.name +
            ' to take photographs and videos of my children ' +
            publicReceipt.allKids
              .map(
                kidId =>
                  publicReceipt.users[kidId].firstName +
                  ' ' +
                  publicReceipt.users[kidId].familyName
              )
              .join(' & ') +
            ', and I grant ' +
            thisAsso.name +
            ' the full rights to use the images resulting from the photography' +
            'and video filming, and any reproductions or ' +
            'adaptations of the images for fundraising, publicity or other ' +
            "purposes to help achieve the association's aims. This might include " +
            '(but is not limited to) the right to use them in their printed and ' +
            'online newsletters, websites, publicities, social media, press ' +
            'releases and funding applications'
          : "I don't give permission to " +
            thisAsso.name +
            ' to take photographs and videos of my children ' +
            publicReceipt.allKids
              .map(
                kidId =>
                  publicReceipt.users[kidId].firstName +
                  ' ' +
                  publicReceipt.users[kidId].familyName
              )
              .join(' & ')) +
        '.\nSignature: ' +
        publicReceipt.users[publicReceipt.allParents[0]].firstName +
        ' ' +
        publicReceipt.users[publicReceipt.allParents[0]].familyName +
        '\n\n' +
        '# Volunteering # \n\n' +
        (publicReceipt.purchasedVolunteeringItems.length > 0
          ? 'I volunteer to help with following activities:\n' +
            publicReceipt.purchasedVolunteeringItems
              .map(
                itemId => '- ' + publicReceipt.purchasedItemsById[itemId].name
              )
              .join('\n')
          : 'I choose not to volunteer to assist with any activities at this time.') +
        '\n\n' +
        '- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -\n';

      const emailData = {
        from: thisAsso.emailFrom,
        to: primaryEmail,
        cc: thisAsso.backupEmail,
        'h:Reply-To': thisAsso.replyTo,
        subject: thisAsso.name + ' / Confirmation of registration',
        text: emailBody
      };

      console.log('emailData: ', emailData);

      try {
        mailgun.messages().send(emailData, function(error, body) {
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
        res
          .status(500)
          .json({ error: error.toString(), receipt: publicReceipt });
      }
    }
  });
};

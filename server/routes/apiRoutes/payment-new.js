const router = require('express').Router();
const capitalizeFirstLetter = require('../../utils/capitalizeFirstLetter');
const validateCharge = require('../../utils/validateCharge');
const requireLogin = require('../../middlewares/requireLogin');
const keys = require('../../config/keys');
const stripe = require('stripe')(keys.stripeSecretKey);
const deepMerge = require('deepmerge');
const mongoose = require('mongoose');
const Asso = mongoose.model('assos');
const User = mongoose.model('users');
const Family = mongoose.model('families');
const wrapAsync = require('../../utils/wrapAsync');
const buildPaymentReceipt = require('../../utils/buildPaymentReceipt');
const emailCardPaymentConfirmation = require('../../utils/emailCardPaymentConfirmation');

router.post(
  '/',
  requireLogin,
  wrapAsync(async (req, res) => {
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

    thisAsso = await Asso.findOne({ id: 'a0' });

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

      family = await req.user.save();
      // TODO rename family to thisFamily to ease search per keyword in code

      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      // save new users (kids and parents) from frontend into
      // `users` collection (firstName, familyName and kidGrade):
      frontendAllParentsAndKids.map(
        wrapAsync(async userId => {
          const newUserData = frontendFamilyById[userId];
          let newOrUpdatedUser;
          existingUser = await User.findOne({ id: userId });
          if (existingUser) {
            newOrUpdatedUser = await existingUser.set(newUserData);
          } else {
            // console.log('creating new user: ', newUserData.firstName);
            newOrUpdatedUser = await new User(newUserData).save();
          }
          newOrUpdatedUser.save();
        })
      );

      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      // execute the payment
      let stripeReceipt;
      if (paymentOption === 'creditCard') {
        stripeReceipt = await stripe.charges.create({
          amount: validatedTotal,
          currency: 'eur',
          description: assoName + '-' + eventName + '-' + primaryEmail,
          source: stripeTokenId
        });

        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        // save stripeCharge receipt into this `family` collection, in database,
        // for future reference:
        const ReceiptsCount = req.user.paymentReceipts.push(stripeReceipt); // NB we won't use this const
        family = await req.user.save();
      }

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

        thisAsso = await Asso.findOne({ id: 'a0' });
        updatedAsso = await thisAsso.set({
          registrations: newRegistered
        });
        updatedAsso.save();

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

      const publicReceipt = buildPaymentReceipt();

      const emailTo = await emailCardPaymentConfirmation(publicReceipt);
    }
  })
);

module.exports = router;

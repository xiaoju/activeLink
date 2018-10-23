const router = require('express').Router();
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
const buildPublicReceipt = require('../../utils/buildPublicReceipt');
const sendEmail = require('../../utils/sendEmail');
const buildEmailData = require('../../utils/buildEmailData_Payment')
  .buildEmailData;
const InvalidInput = require('../../errors/InvalidInput');

router.post(
  '/',
  requireLogin,
  wrapAsync(async (req, res) => {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // const userInput = saveUserInput(req.body);
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // Save the raw user input (userInput) into database for future reference
    const { stripeToken, ...userInput } = req.body;
    userInput.timestamp = Date.now();
    if (stripeToken) {
      userInput.stripeTokenId = stripeToken.id;
    }
    req.user.inputsHistory.push(userInput);

    // TODO .trim() on familyNames and firstNames

    // rename the variables from frontend, for clarity:
    const { familyId, primaryEmail } = req.user;
    const {
      paymentOption,
      installmentsQuantity,
      eventId: frontendEventId,
      validKids: frontendAllKids,
      validParents: frontendAllParents,
      validAddresses: frontendAddresses,
      validMedia: frontendMedia,
      validFamilyById: frontendFamilyById,
      total: frontendTotal,
      photoConsent: frontendPhotoConsent,
      validChecked: frontendChecked,
      stripeTokenId
    } = userInput;
    const frontendAllParentsAndKids = frontendAllKids.concat(
      frontendAllParents
    );

    let thisAsso = await Asso.findOne({ id: 'a0' });
    // TODO I shouldn't be looking up this data again, I already did it in authRoutes (get)!
    const assoName = thisAsso.name;
    const thisEvent = thisAsso.eventsById.e0;
    // TODO e0 and a0 are hardcoded!
    const previousRegistered = thisAsso.registrations;

    let applyDiscount = validateCharge({
      familyId,
      frontendAllKids,
      frontendAllParents,
      frontendMedia,
      frontendFamilyById,
      frontendTotal,
      frontendChecked,
      thisEvent
    });

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

      User.deleteMany({ id: { $in: droppedParentsAndKids } });
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

    let thisFamily = await req.user.save();

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // NewUsersSaved = await saveNewUsers(frontendAllParentsAndKids, frontendFamilyById);
    // save new users (kids and parents) from frontend into
    // `users` collection (firstName, familyName and kidGrade):
    frontendAllParentsAndKids.map(
      wrapAsync(async userId => {
        const newUserData = frontendFamilyById[userId];
        let newOrUpdatedUser;
        let existingUser = await User.findOne({ id: userId });
        if (existingUser) {
          newOrUpdatedUser = await existingUser.set(newUserData);
        } else {
          newOrUpdatedUser = await new User(newUserData).save();
        }
        newOrUpdatedUser.save();
      })
    );

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // handleStripePaymentSpecifics()
    // execute the payment

    const eventName = thisAsso.eventsById.e0.eventName;
    const chargeDescription = assoName + '-' + eventName + '-' + primaryEmail;

    let stripeReceipt;

    if (paymentOption === 'creditCard') {
      stripeReceipt = await stripe.charges.create({
        amount: frontendTotal,
        currency: 'eur',
        description: chargeDescription,
        source: stripeTokenId
      });

      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      // save stripeCharge receipt into this `family` collection, in database,
      const ReceiptsCount = req.user.paymentReceipts.push(stripeReceipt); // NB we won't use this const

      thisFamily = await req.user.save(); // TODO move this few lines after, outside of if loop, then remove the other similar line
    }

    if (
      (paymentOption === 'creditCard' &&
        stripeReceipt.status === 'succeeded') ||
      paymentOption === 'bankTransfer' ||
      paymentOption === 'moneyCheque'
    ) {
      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      // save the paid classes into the `registrations` property of `asso`
      // registrationSaved = await saveRegistrations(previousRegistered, frontendChecked);

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

      updatedAsso = await thisAsso.set({ registrations: newRegistered });
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

    const publicReceipt = await buildPublicReceipt({
      familyId,
      primaryEmail,
      applyDiscount,
      frontendChecked,
      frontendTotal,
      thisFamily,
      thisAsso: updatedAsso,
      thisEvent,
      stripeReceipt,
      userInput,
      newRegisteredEvents
    });
    const emailData = buildEmailData(publicReceipt, thisAsso);
    const sentEmailData = await sendEmail(emailData);

    console.log(
      '%s %s %s: REGISTRATION CONFIRMATION sent to %s and %s. Payment option: %s',
      req.ip,
      primaryEmail,
      req.originalUrl,
      sentEmailData.to,
      sentEmailData.cc,
      sentEmailData.frontEndData.paymentOption
    );

    res.status(200).send(publicReceipt);
  })
);

module.exports = router;

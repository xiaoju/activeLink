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
const InvalidInput = require('../../errors/InvalidInput');

router.post(
  '/',
  requireLogin,
  wrapAsync(async (req, res) => {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // const userInput = saveUserInput(req.body);
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

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // look up the event details, from backend database
    // TODO I shouldn't be looking up this data again, I already did it in authRoutes (get)!

    let thisAsso = await Asso.findOne({ id: 'a0' });
    const assoName = thisAsso.name;
    const thisEvent = thisAsso.eventsById.e0;
    // TODO e0 and a0 are hardcoded!
    const previousRegistered = thisAsso.registrations;
    const {
      eventId,
      eventName,
      discountedPrices,
      standardPrices
    } = thisAsso.eventsById.e0;

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    let applyDiscount = validateCharge({
      familyId,
      frontendCharge,
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

    let thisFamily = await req.user.save();

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
      // for future reference:
      const ReceiptsCount = req.user.paymentReceipts.push(stripeReceipt); // NB we won't use this const
      // console.log('billingRoutes, 270, ReceiptsCount: ', ReceiptsCount);
      // console.log('billingRoutes, 283, stripeReceipt.id: ', stripeReceipt.id);

      thisFamily = await req.user.save();
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

      // console.log('previousRegistered: ', previousRegistered);
      // console.log('frontendChecked: ', frontendChecked);
      // console.log('newRegistered: ', newRegistered);

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

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // build receipt data out of stripeReceipt and database data
    // TODO beware that from here on `stripeReceipt.status` can be 'succeeded' or not
    const allKidsAndParents = [].concat(
      thisFamily.allKids,
      thisFamily.allParents
    );
    const allKidsFamilyParents = [familyId].concat(allKidsAndParents);

    thisFamily = await Family.findOne({ familyId });

    // TODO rename users (the extract from database) to usersArray, to avoid mix up format (array vs object)

    users = await User.find({ id: { $in: allKidsAndParents } }); // [{id, firstName, familyName, kidGrade},{},...]

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
        thisFamily.allParents.map(thisParentId =>
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
      allKids: thisFamily.allKids,
      allParents: thisFamily.allParents,
      addresses: thisFamily.addresses,
      primaryEmail,
      familyMedia: thisFamily.familyMedia,
      photoConsent: thisFamily.photoConsent,
      eventName,
      paymentOption,
      paymentReference,
      datesToPay: thisEvent.installmentDates,
      bankReference: thisAsso.bankReference[0],
      installmentsQuantity:
        paymentOption !== 'creditCard' ? thisEvent.installments * 1 : 1,
      chequeOrder: thisAsso.chequeOrder,
      chequeCollection: thisAsso.chequeCollection,
      total: frontendTotal,
      livemode: paymentOption === 'creditCard' ? stripeReceipt.livemode : null,
      timeStamp: paymentOption === 'creditCard' ? stripeReceipt.created : null,
      currency: paymentOption === 'creditCard' ? stripeReceipt.currency : null,
      last4: paymentOption === 'creditCard' ? stripeReceipt.source.last4 : null,
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

    // const publicReceipt = buildPublicReceipt(thisAsso, stripeReceipt, thisEvent, )

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
  })
);

module.exports = router;

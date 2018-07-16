const keys = require('../config/keys');
const stripe = require('stripe')(keys.stripeSecretKey);
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

    // rename the variables from frontend, for clarity:
    const familyId = req.user.familyId,
      frontendAllKids = req.body.validKids,
      frontendAllParents = req.body.validParents,
      frontendAllParentsAndKids = frontendAllKids.concat(frontendAllParents),
      frontendMedia = req.body.validMedia,
      frontendFamilyById = req.body.validFamilyById,
      frontendTotal = req.body.total,
      frontendChecked = req.body.validChecked,
      frontendCharge = {
        frontendAllKids,
        frontendAllParents,
        frontendMedia,
        frontendFamilyById,
        frontendTotal,
        frontendChecked
      };

    // look up the event details, from backend database
    // TODO I shouldn't be looking up this data again, I already did it in authRoutes (get)!

    let thisAsso;
    let thisEvent;
    let previousRegistered;

    // lookup event information from database
    try {
      thisAsso = await Asso.findOne({ id: 'a0' });
      thisEvent = thisAsso.eventsById.e0;
      previousRegistered = thisAsso.registrations;
    } catch (error) {
      console.log('billingRoutes.js // line 38 // error: ', error);
    }

    // ######## form validation ########
    // TODO move this to a middleware
    // check that the charge request received from frontend is valid
    const chargeErrors = validateCharge({
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
      // ######## form validation ########

      // "Delete" (= set `deleted` flag to `true`) kids and parents in the
      // `users` collection, who have been deleted as per frontend form. For
      // this, compare what IDs are missing in the new
      // `frontendAllParentsAndKids` compared to the old
      // `allKids + allParents from family collection`.
      // TODO change from real delete to just `delete` flag
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
            console.log('error by deleteMany: ', err);
          }
          // else {
          // console.log('deleteMany succeeded.');
          // }
        });
      }

      // save updated profile from frontend into
      // `family` collection (familyMedia, list of kidIds, list of parentIds):
      req.user.allKids = frontendAllKids;
      req.user.allParents = frontendAllParents;
      req.user.familyMedia = frontendMedia;
      try {
        family = await req.user.save();
      } catch (error) {
        console.log(
          'billingRoutes.js, line 100: error by saving frontend info into family collection',
          error
        );
      }

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
            'billingRoutes.js // line 108 // error by findOne: ',
            error
          );
        }

        if (existingUser) {
          // console.log('found existing user: ', newUserData.firstName);
          try {
            newOrUpdatedUser = await existingUser.set(newUserData);
          } catch (error) {
            console.log('error by replacing old data: ', error);
          }
        } else {
          // console.log('creating new user: ', newUserData.firstName);
          try {
            newOrUpdatedUser = await new User(newUserData).save();
          } catch (error) {
            console.log('error by creating new user: ', error);
          }
        }
        newOrUpdatedUser.save();
        // console.log('newOrUpdatedUser: ', newOrUpdatedUser);
      });

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
        console.log('Error while connecting to Stripe server: ', error);
      }

      // save stripeCharge receipt into database for future reference:
      const ReceiptsCount = req.user.paymentReceipts.push(stripeReceipt); // NB we won't use this const
      try {
        family = await req.user.save();
      } catch (error) {
        console.log('Error while saving stripeCharge to database: ', error);
      }

      if (stripeReceipt.status === 'succeeded') {
        try {
          // save the paid classes into the `registrations` property of `asso`

          const arrayMerge = (arr1, arr2) => [...new Set(arr1.concat(arr2))];
          // arrayMerge defines how the deepMerge shall proceed with arrays:
          // concatenate and remove the duplicates.

          let newRegistered = deepMerge(previousRegistered, frontendChecked, {
            arrayMerge
          });
          console.log('previousRegistered: ', previousRegistered);
          console.log('frontendChecked: ', frontendChecked);
          console.log('newRegistered: ', newRegistered);

          let thisAsso;
          try {
            thisAsso = await Asso.findOne({ id: 'a0' });
          } catch (error) {
            console.log(
              'billingRoutes.js, line 185 // error by findOne Asso: ',
              error
            );
          }
          try {
            updatedAsso = await thisAsso.set({ registrations: newRegistered });
          } catch (error) {
            console.log(
              'billingRoutes.js, line 193 // error by saving newRegistered: ',
              error
            );
          }

          try {
            updatedAsso.save();
          } catch (error) {
            console.log(
              'billingRoutes.js, line 202, error by saving modified asso to db: ',
              error
            );
          }
        } catch (error) {
          console.log('Error while saving the paid classes to database');
        }
      }

      // build receipt out of stripeReceipt and database data
      const allKidsAndParents = [].concat(family.allKids, family.allParents);
      const allKidsFamilyParents = [familyId].concat(allKidsAndParents);
      family = await Family.findOne({ familyId });
      users = await User.find({
        id: { $in: allKidsAndParents }
        // [{id, firstName, familyName, kidGrade},{},...]
      });
      const normalizedUsers = users.reduce((obj, thisUser) => {
        obj[thisUser.id] = thisUser;
        return obj;
      }, {});
      // normalized state
      console.log('users: ', users);
      console.log('#######');
      console.log('normalizedUsers: ', normalizedUsers);

      // TODO try get registrations directly through a (nested) database query
      // const registrations = await Asso.find({
      //   userId: { $in: allKidsAndParents }
      // });
      const thisAsso = await Asso.findOne({ id: 'a0' });
      const registrations = allKidsFamilyParents.map(userId => ({
        [userId]: thisAsso.registrations[userId]
      }));

      let publicReceipt = {
        users: normalizedUsers, // [{firstName, familyName, kidGrade},{},...]
        allKids: family.allKids,
        allParents: family.allParents,
        familyMedia: family.familyMedia,
        photoConsent: family.photoConsent,
        eventName: thisEvent.eventName,
        total: stripeReceipt.amount,
        timeStamp: stripeReceipt.created,
        currency: stripeReceipt.currency,
        last4: stripeReceipt.source.last4,
        status: stripeReceipt.status,
        chargeId: stripeReceipt.id,
        registrations
        // discountApplied,
        // purchasedItems,
        //    name,
        //    period,
        //    paidPrice,
        //    beneficiaries // ['Mulan', 'Zilan'] or ['Obama-Trump']
        //
        // errors
      };
      console.log('publicReceipt: ', publicReceipt);

      // TODO build a correct paymentReceipt, also based on the error messages
      res.send(publicReceipt);

      // send the payment receipt to front end:
    }
  });
};

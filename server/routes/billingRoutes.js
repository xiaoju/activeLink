const keys = require('../config/keys');
const stripe = require('stripe')(keys.stripeSecretKey);
const requireLogin = require('../middlewares/requireLogin');
const deepMerge = require('deepmerge');

const mongoose = require('mongoose');
const Asso = mongoose.model('assos');
const User = mongoose.model('users');

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
    try {
      thisAsso = await Asso.findOne({ id: 'a0' });
      thisEvent = thisAsso.eventsById.e0;
      previousRegistered = thisAsso.registered;
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

      // Remove from `users` collection the kids and parents that have been
      // deleted as per frontend form. For this, compare what IDs are missing in
      //  the new `frontendAllParentsAndKids` compared to the old
      // `allKids + allParents from family collection`
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
          } else {
            console.log('deleteMany succeeded.');
          }
        });
      }

      // save updated profile from frontend into `family` collection:
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

      // save new users (kids and parents) from frontend into `users` collection
      // (only firstName, familyName and kidGrade):
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
      let stripeCharge;
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
      try {
        ReceiptsCount = req.user.paymentReceipts.push(stripeReceipt);
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
            updatedAsso = await thisAsso.set({ registered: newRegistered });
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

      // TODO build a correct paymentReceipt, also based on the error messages
      res.send(paymentReceiptDraft);

      // send the payment receipt to front end:
    }
  });
};

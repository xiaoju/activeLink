const keys = require('../config/keys');
const stripe = require('stripe')(keys.stripeSecretKey);
const requireLogin = require('../middlewares/requireLogin');

const mongoose = require('mongoose');
const Asso = mongoose.model('assos');
const User = mongoose.model('users');

const paymentReceiptDraft = require('../models/paymentReceiptDraft');
const validateCharge = require('../utils/validateCharge');

module.exports = app => {
  app.post('/api/payment', requireLogin, async (req, res) => {
    let family; // this will contain the family data, after pulling it from database

    // rename the variables from frontend, for clarity:
    const frontendAllKids = req.body.validKids,
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
    const thisAsso = await Asso.findOne({ id: 'a0' });
    const thisEvent = thisAsso.eventsById.e0;

    // ######## form validation ########
    // TODO move this to a middleware
    // check that the charge request received from frontend is valid
    const chargeErrors = validateCharge({
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
      family = await req.user.save();

      // save new users (kids and parents) from frontend into `users` collection
      // (only firstName, familyName and kidGrade):

      frontendAllParentsAndKids.map(async userId => {
        const newUserData = frontendFamilyById[userId];
        let newOrUpdatedUser;

        let existingUser;
        try {
          existingUser = await User.findOne({ id: userId });
        } catch (error) {
          console.log('error by findOne: ', error);
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

      // remove from `users` collection the kids & parents deleted from frontend

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

      // TODO build a correct paymentReceipt
      res.send(paymentReceiptDraft);

      // save stripeCharge receipt into database for future reference:
      try {
        ReceiptsCount = req.user.paymentReceipts.push(stripeReceipt);
        family = await req.user.save();
      } catch (error) {
        console.log('Error while saving stripeCharge to database: ', error);
      }

      if (stripeReceipt.status === 'succeeded') {
        try {
          console.log('I should be saving the paid classes to database!');
          // save the paid classes to user profile in database
          // and to allUsers database
          // TODO write code!!
          // registeredCount = req.user.registeredCount.push();
          // registeredById;
          // user = await req.user.save();
        } catch (error) {
          console.log('Error while saving the paid classes to database');
        }
      }

      // send the payment receipt to front end:
    }

    // } catch (error) {
    // console.log('An error occured: ', error);
    // res.status(500).send({ error: 'boo:(' });
    // res.render('error', { error });
    // res.send({ error });
    // }
    // }

    // console.log('BACKEND, received payload: ', req.body);
    // req.user.credits += 5;
    // const user = await req.user.save();
    // saving stuff into database
    // res.send(user);
  });
};

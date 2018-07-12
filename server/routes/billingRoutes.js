const keys = require('../config/keys');
const stripe = require('stripe')(keys.stripeSecretKey);
const requireLogin = require('../middlewares/requireLogin');

const mongoose = require('mongoose');
const Asso = mongoose.model('assos');

const paymentReceiptDraft = require('../models/paymentReceiptDraft');
const validateCharge = require('../utils/validateCharge');

module.exports = app => {
  app.post('/api/payment', requireLogin, async (req, res) => {
    let user; // this will contain the user data, after pulling it from database

    // rename the variables from frontend, for clarity:
    const frontendCharge = {
      frontendAllKids: req.body.validKids,
      frontendAllParents: req.body.validParents,
      frontendMedia: req.body.validMedia,
      frontendFamilyById: req.body.validFamilyPerId,
      frontendTotal: req.body.total,
      frontendChecked: req.body.validChecked
    };

    // look up the event details, from backend database
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

      // save update profile data from frontend into database:
      req.user.allKids = frontendCharge.frontendAllKids;
      req.user.allParents = frontendCharge.frontendAllParents;
      req.user.familyMedia = frontendCharge.frontendMedia;
      req.user.familyPerId = frontendCharge.frontendFamilyById;
      user = await req.user.save();

      const chargeDescription =
        req.body.familyId + '-' + req.body.eventId + '-';

      // execute the paiement
      let stripeCharge;
      try {
        stripeReceipt = await stripe.charges.create({
          amount: frontendCharge.frontendTotal,
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
        user = await req.user.save();
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
          // registeredPerId;
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

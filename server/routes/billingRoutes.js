const keys = require('../config/keys');
const stripe = require('stripe')(keys.stripeSecretKey);
const requireLogin = require('../middlewares/requireLogin');

const { eventsById } = require('../models/draftState');
const paymentReceiptDraft = require('../models/paymentReceiptDraft');
const validateCharge = require('../utils/validateCharge');

module.exports = app => {
  app.post('/api/payment', requireLogin, async (req, res) => {
    // try {
    // console.log('/api/payment (post), req.body: ', req.body);

    // rename the variables from frontend, for clarity:
    const frontendCharge = {
      frontendAllKids: req.body.validKids,
      frontendAllParents: req.body.validParents,
      frontendMedia: req.body.validMedia,
      frontendFamilyById: req.body.validFamilyPerId,
      frontendTotal: req.body.total,
      frontendChecked: req.body.validChecked
    };

    // look up the event details, from backend "database"
    const thisEvent = eventsById.e0;

    // check that the charge request received from frontend is valid
    // TODO move this to a middleware
    // console.log('validateCharge function: ', validateCharge);
    const chargeErrors = validateCharge({
      frontendCharge,
      thisEvent
    });
    // console.log('chargeErrors: ', chargeErrors);

    if (chargeErrors.length) {
      res.status(500).send({
        error:
          'There was something wrong with the data received from the form, so we cancelled the payment.'
      });
      // this custom error text is actually not shown in my client app
    } else {
      // if (testTotal.errorTotal) {
      //   paymentReceipt = {
      //     error:
      //       'Mismatch of total price calculated by frontend vs calculated by backEnd'
      //   };
      // } else {
      // try {

      // save data from frontend into database:
      req.user.allKids = frontendCharge.frontendAllKids;
      req.user.allParents = frontendCharge.frontendAllParents;
      req.user.familyMedia = frontendCharge.frontendMedia;
      req.user.familyPerId = frontendCharge.frontendFamilyById;
      const user = await req.user.save();

      const chargeDescription = req.body.eventId;

      let stripeCharge;
      try {
        stripeCharge = await stripe.charges.create({
          amount: frontendCharge.frontendTotal,
          currency: 'eur',
          description: chargeDescription,
          source: req.body.stripeToken.id
        });
      } catch (error) {
        console.log('Error while connecting to Stripe server: ', error);
      }

      // console.log('stripeCharge: ', stripeCharge);
      // TODO save stripeCharge to database for future reference.

      // TODO check that payment succeeded
      const chargeStatus = stripeCharge.status;
      const last4 = stripeCharge.source.last4;
      const receiptTimeStamp = stripeCharge.created;

      // TODO save the paid classes to the user in database,

      // TODO then extract the most recent payment receipt,
      // which will look like `paymentReceiptDraft`

      // TODO send the order confirmation to frontEnd:
      res.send(paymentReceiptDraft);
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

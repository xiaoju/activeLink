const keys = require('../config/keys');
const stripe = require('stripe')(keys.stripeSecretKey);
const requireLogin = require('../middlewares/requireLogin');

module.exports = app => {
  app.post('/api/payment', requireLogin, async (req, res) => {
    console.log('req.body: ', req.body);

    // first should update the profiles database with
    //   familyId
    //   validKids
    //   validParents
    //   validMedia
    //   validFamilyPerId

    // extract required info from database:
    // prices (standard/discounted), discount qualifiers, etc etc

    // test if all madatory items are well checked
    // test if kidGrades match classGrades
    // calculate if discount applies

    // then calculate the invoiceTotal, based on
    // req.body.validChecked
    // req.body.eventId (to get the prices)
    //   eventId: 'e0',
    //   validChecked: { '7jhfbasd8jfhbeas8': [ 'i0' ]
    // standardPrices: {
    //   i0: 3000,
    //   i1: 22500,
    //   i2: 45000,
    //   i3: 15000,
    //   i4: 18000,
    //   i5: 18000,
    //   i6: 10500,
    //   i7: 25500
    // },
    // discountedPrices: {
    //   i0: 3000,
    //   i1: 16500,
    //   i2: 39000,
    //   i3: 15000,
    //   i4: 18000,
    //   i5: 18000,
    //   i6: 10500,
    //   i7: 25500
    // },
    // discountQualifiers: ['i1', 'i2'],
    // mandatoryItems: ['i0'],
    // familyItems: ['i0'],

    // TODO check that total from client is same as calculating locally in backend
    const chargeTotal = req.body.total;

    // TODO get eventId from payload -> check that event is opened for registration -> eventName
    const chargeDescription = req.body.eventId;

    // TODO
    // ( test if kids fulfill the classGrades conditions) && (error.wrongGrade)
    // ( test if event is open for booking) && (error.closedEvent = true)
    // (chargeTotal !== exportData.total) && (error.totalMismatch = true)
    // !!error && "There was a problem with your order. We couldn't complete your registration to this event. Your credit card hasn't been charged. You can try again or contact xxx for suport. We are sorry for the inconvenience."
    // log the error.

    try {
      const stripeCharge = await stripe.charges.create({
        amount: chargeTotal,
        currency: 'eur',
        description: chargeDescription,
        source: req.body.stripeToken.id
      });
      // console.log('stripeCharge: ', stripeCharge);

      // TODO save stripeCharge to database for future reference.

      // TODO check that payment succeeded
      const chargeStatus = stripeCharge.status;
      const last4 = stripeCharge.source.last4;
      const receiptTimeStamp = stripeCharge.created;
      console.log('status of the StripeCharge: ', chargeStatus);

      // TODO save the paid classes to the user in database,
      // TODO then extract the most recent payment receipt,
      // which will look like this:
      const paymentReceipt = {
        familyName: 'Bush-Polanski',
        familyId: '7jhfbasd8jfhbeas8',
        eventId: 'e0',
        eventName: 'Registration 2018-2019',
        invoiceTotal: 543200,
        receiptTimeStamp: 1530696643,
        last4: 4242,
        paymentStatus: 'succeeded',
        purchasedItems: [
          {
            id: 'i0',
            name: 'Registration to the association',
            period: '2018-2019',
            paidPrice: 3000,
            beneficiaries: ['Mulan', 'Zilan']
          },
          {
            id: 'i4',
            name: 'Mini Kids Club',
            period: '2018-2019',
            paidPrice: 36000,
            beneficiaries: ['Bush-Polanski']
          },
          {
            id: 'i7',
            name: 'On Stage!',
            period: '2018-2019',
            paidPrice: 25500,
            beneficiaries: ['Bush-Polanski']
          }
        ]
      };
      res.send({ paymentReceipt });
    } catch (e) {
      return console.log('an error occured: ', e);
    }

    // console.log('BACKEND, received payload: ', req.body);
    // req.user.credits += 5;
    // const user = await req.user.save();
    // saving stuff into database

    // send the order confirmation to frontEnd:
    // {paymentReceipt}, {allRegistered} and the invitation to volonteer
    // res.send(user);
  });
};

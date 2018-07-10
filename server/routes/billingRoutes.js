const keys = require('../config/keys');
const stripe = require('stripe')(keys.stripeSecretKey);
const requireLogin = require('../middlewares/requireLogin');
const { eventsById } = require('../models/draftState');
const getTotalReview = require('../utils/getTotalReview');

module.exports = app => {
  app.post('/api/payment', requireLogin, async (req, res) => {
    console.log('/api/payment (post), req.body: ', req.body);

    // save data from frontend form into database
    req.user.allKids = req.body.validKids;
    req.user.allParents = req.body.validParents;
    req.user.familyMedia = req.body.validMedia;
    req.user.familyPerId = req.body.validFamilyPerId;
    const user = await req.user.save();

    // extract required info from database:
    // prices (standard/discounted), discount qualifiers, etc etc
    const {
      discountQualifiers,
      standardPrices,
      discountedPrices
    } = eventsById.e0;

    const totalReview = getTotalReview({
      allKids: req.body.validKids,
      frontendTotal: req.body.total,
      familyPerId: req.body.validFamilyPerId,
      discountQualifiers,
      standardPrices,
      discountedPrices,
      checked: req.body.validChecked
    });

    console.log('totalReview: ', totalReview);

    // test if all madatory items are well checked
    // test if kidGrades match classGrades

    // TODO get eventId from payload -> check that event is opened for registration -> eventName
    const chargeDescription = req.body.eventId;

    // TODO
    // ( test if kids fulfill the classGrades conditions) && (error.wrongGrade)
    // ( test if event is open for booking) && (error.closedEvent = true)
    // (chargeTotal !== exportData.total) && (error.totalMismatch = true)
    // !!error && "There was a problem with your order. We couldn't complete your registration to this event. Your credit card hasn't been charged. You can try again or contact xxx for suport. We are sorry for the inconvenience."
    // log the error.

    if (totalReview.errorTotal) {
      paymentReceipt = {
        error:
          'Mismatch of total price calculated by frontend vs calculated by backEnd'
      };
    } else {
      try {
        const stripeCharge = await stripe.charges.create({
          amount: totalReview.backendTotal,
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
        // console.log('status of the StripeCharge: ', chargeStatus);

        // TODO save the paid classes to the user in database,
        // TODO then extract the most recent payment receipt,
        // which will look like this:
        const paymentReceipt = {
          familyName: 'Bush-Polanski',
          familyId: '7jhfbasd8jfhbeas8',
          eventId: 'e0',
          eventName: 'Registration 2018-2019',
          invoiceTotal: totalReview.backendTotal, // TODO recalculate the total within backend
          receiptTimeStamp: 1530696643,
          last4: 4242,
          paymentStatus: 'succeeded',
          allPurchasedToday: [
            {
              id: 'i0',
              name: 'Registration to the association',
              period: '2018-2019',
              paidPrice: 3000,
              beneficiaries: ['Bush-Polanski']
            },
            {
              id: 'i4',
              name: 'Mini Kids Club',
              period: '2018-2019',
              paidPrice: 36000,
              beneficiaries: ['Mulan', 'Zilan']
            },
            {
              id: 'i7',
              name: 'On Stage!',
              period: '2018-2019',
              paidPrice: 25500,
              beneficiaries: ['Mulan']
            }
          ],
          // following are not 'paymentReceipt', however sent together
          allKids: req.user.allKids,
          allParents: req.user.allParents,
          familyPerId: req.user.familyPerId,
          familyMedia: req.user.familyMedia,
          allEvents: [],
          bookedEvents: ['e0'],
          allRegisteredItems: [
            { userId: 'family', items: ['i0'] },
            { userId: 'k0', items: ['i4', 'i7'] },
            { userId: 'k1', items: ['i4'] }
          ],
          itemsPerId: {
            i0: {
              id: 'i0',
              name: 'Registration to the association',
              period: '2018-2019',
              teacherName: 'Michelle Obama',
              description:
                'The registration to the English Link association is required to join the activities. School year 2018-2019.',
              itemGrades: ['PS', 'MS', 'GS', 'CP', 'CE1', 'CE2', 'CM1', 'CM2']
            },
            i4: {
              id: 'i4',
              name: 'Mini Kids Club',
              period: '2018-2019',
              teacherName: 'Michelle Obama',
              description:
                'Dynamic and renewed activities in english for bilingual kids. For CP & CE1. Monday 12:30-13:30.',
              contacts: ['s2'],
              itemGrades: ['CP', 'CE1']
            },
            i7: {
              id: 'i7',
              name: 'On Stage!',
              period: '2018-2019',
              teacherName: "Jeanne d'Arc",
              description:
                'Theater in English for bilingual kids. A work on acting and staging, shown on stage at the end of the year. Tuesday 16:30-18:00.',
              contacts: ['s2'],
              itemGrades: ['CP', 'CE1', 'CE2', 'CM1', 'CM2']
            }
    try {
          }

      res.send({ paymentReceipt });
    } catch (error) {
      console.log('An error occured: ', error);
      res.status(500).send({ error: 'boo:(' });
      // res.render('error', { error });
      // res.send({ error });
    }
    // }

    // console.log('BACKEND, received payload: ', req.body);
    // req.user.credits += 5;
    // const user = await req.user.save();
    // saving stuff into database

    // send the order confirmation to frontEnd:
    // {paymentReceipt}, {allRegistered} and the invitation to volonteer
    // res.send(user);
  });
};

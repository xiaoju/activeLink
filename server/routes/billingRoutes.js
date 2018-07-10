const keys = require('../config/keys');
const stripe = require('stripe')(keys.stripeSecretKey);
const requireLogin = require('../middlewares/requireLogin');
const { eventsById } = require('../models/draftState');
const getTestTotal = require('../utils/getTestTotal');
const testKids = require('../utils/testKids');
const testMandatory = require('../utils/testMandatory');
// const datasetForTest = require('../utils/datasetForTest');

module.exports = app => {
  app.post('/api/payment', requireLogin, async (req, res) => {
    try {
      const errors = [];
      // console.log('/api/payment (post), req.body: ', req.body);

      // // rename the variables from frontend, for clarity:
      const frontendAllKids = req.body.validKids;
      const frontendAllParents = req.body.validParents;
      const frontendMedia = req.body.validMedia;
      const frontendFamilyById = req.body.validFamilyPerId;
      const frontendTotal = req.body.total;
      const frontendChecked = req.body.validChecked;

      // invalid data for test
      // const {
      //   frontendAllKids,
      //   frontendAllParents,
      //   frontendMedia,
      //   frontendFamilyById,
      //   frontendTotal,
      //   frontendChecked
      // } = datasetForTest;

      // save data from frontend into database:
      req.user.allKids = frontendAllKids;
      req.user.allParents = frontendAllParents;
      req.user.familyMedia = frontendMedia;
      req.user.familyPerId = frontendFamilyById;
      const user = await req.user.save();

      // check if the kids data from frontend is valid:
      const errorValidKids = testKids({
        allKids: frontendAllKids,
        familyById: frontendFamilyById
      });
      errorValidKids && errors.push('Kids from frontend not all valid. ');
      console.log('errorValidKids: ', errorValidKids);

      // extract required event information from database:
      const {
        discountQualifiers,
        standardPrices,
        discountedPrices,
        mandatoryItems,
        familyItems
      } = eventsById.e0;

      // check if the total price calculated by frontend is correct
      const testTotal = getTestTotal({
        frontendAllKids,
        frontendTotal,
        frontendFamilyById,
        frontendChecked,
        discountQualifiers,
        standardPrices,
        discountedPrices
      });
      testTotal.errorTotal &&
        errors.push(
          'Mismatch total price calculated by frontend vs calculated by backend. '
        );
      console.log('testTotal.errorTotal: ', testTotal.errorTotal);

      // test if all mandatory items have been selected (selected by 'family' for
      // the familyItems, selected by every Kids for the other items)
      const errorMandatoryItems = testMandatory({
        checked: frontendChecked,
        mandatoryItems,
        familyItems,
        allKids: frontendAllKids
      });

      // test if kidGrades match classGrades

      // TODO get eventId from payload -> check that event is opened for registration -> eventName
      const chargeDescription = req.body.eventId;

      // TODO
      // ( test if kids fulfill the classGrades conditions) && (error.wrongGrade)
      // ( test if event is open for booking) && (error.closedEvent = true)
      // (chargeTotal !== exportData.total) && (error.totalMismatch = true)
      // !!error && "There was a problem with your order. We couldn't complete your registration to this event. Your credit card hasn't been charged. You can try again or contact xxx for suport. We are sorry for the inconvenience."
      // log the error.

      // if (testTotal.errorTotal) {
      //   paymentReceipt = {
      //     error:
      //       'Mismatch of total price calculated by frontend vs calculated by backEnd'
      //   };
      // } else {
      // try {
      const stripeCharge = await stripe.charges.create({
        amount: testTotal.backendTotal,
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
        invoiceTotal: testTotal.backendTotal, // TODO recalculate the total within backend
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
        }
      };

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

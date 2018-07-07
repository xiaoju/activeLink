const keys = require('../config/keys');
const stripe = require('stripe')(keys.stripeSecretKey);
const requireLogin = require('../middlewares/requireLogin');

module.exports = app => {
  app.post('/api/payment', requireLogin, async (req, res) => {
    console.log('/api/payment (post), req.body: ', req.body);

    // req.user.allKids = req.body.validKids;
    // req.user.req.validParents = body.validParents;
    // req.user.validMedia = req.body.validMedia;
    // req.user.validFamilyPerId = req.body.validFamilyPerId;
    //
    // await req.user.validKids.save();
    // await req.user.validParents.save();
    // await req.user.validMedia.save();
    // const user = await req.user.save();

    req.user.allKids = ['k0', 'k1', 'k2', 'k3'];
    // req.user.allParents = ['p0', 'p1'];
    const user = await req.user.save();

    // req.user.allKids = req.body.validKids;
    // req.user.allParents = req.body.validParents;
    // req.user.familyMedia = req.body.validMedia;
    // req.user.familyPerId = req.body.validFamilyPerId;
    // const user = await req.user.save();

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
      // console.log('status of the StripeCharge: ', chargeStatus);

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
        allKids: ['k0', 'k1'],
        allParents: ['p0', 'p1'],
        allEvents: [],
        allRegistered: [
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
        },
        familyPerId: {
          p0: {
            id: 'p0',
            firstName: 'Donald',
            familyName: 'Bush'
          },
          p1: {
            id: 'p1',
            firstName: 'Rosemary',
            familyName: 'Polanski'
          },
          k0: {
            id: 'k0',
            firstName: 'Mulan',
            familyName: 'Bush',
            kidGrade: 'CE2'
          },
          k1: {
            id: 'k1',
            firstName: 'Zilan',
            familyName: 'Polanski',
            kidGrade: 'GS'
          }
        },
        familyMedia: [
          {
            media: 'email',
            value: 'donald@xiaoju.io',
            tags: ['Donald', 'private']
          },
          { media: 'phone', value: '0600000000', tags: ['mobile', 'Donald'] }
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

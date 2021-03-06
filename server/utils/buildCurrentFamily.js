const mongoose = require('mongoose');
const Asso = mongoose.model('assos');
const User = mongoose.model('users');
const wrapAsync = require('./wrapAsync');

module.exports = wrapAsync(async req => {
  // for now only one asso
  let thisAsso = await Asso.findOne({ id: 'a0' });

  // all asso details for the assos where this family is a parent.
  // Obtained from database, find in assos collection the documents that match
  // the IDs listed in req.user.roles.parent
  // [{'id': 'a0', ...}, {'id': 'a1', ...}, ...]
  let theseAssos = [thisAsso];

  // normalize theseAssos for redux:
  let assosById = theseAssos.reduce(function(obj, thisAsso) {
    obj[thisAsso.id] = thisAsso;
    return obj;
  }, {});
  // for one asso, we simply get: AssosById = {a0: {id: 'a0', ...}}

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // Build `familyById` out of database records. It contains the detailed
  // information (firstName, familyName, kidGrade) for the kids and parents
  // belonging to this family.
  // Then send `familyById` to frontEnd
  // BUG if the family wasn't created yet, req.user is undefined
  // if (!req.user.allKids) {
  // TODO check the whole logic here!
  let familyById;
  let familyByIdArray;
  if (!req.user) {
    const familyById = {};
  } else {
    const allParentsAndKids = req.user.allKids.concat(req.user.allParents);

    familyByIdArray = await User.find({ id: { $in: allParentsAndKids } });

    // convert familyByIdArray [{...},{..}] to an object: {id:{...}, id:{...}}
    familyById = familyByIdArray.reduce((obj, item) => {
      obj[item.id] = item;
      return obj;
    }, {});
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // build familyRegistrations out of `registrations` from assos collection
  // (actually similar code when building the orderReceipt in `billingRoutes`)
  let familyRegistrations;
  if (!req.user) {
    familyRegistrations = [];
  } else {
    const { familyId, allKids, allParents } = req.user;
    const allKidsAndParents = [].concat(allKids, allParents);
    const allKidsFamilyParents = [familyId].concat(allKidsAndParents);
    familyRegistrations = allKidsFamilyParents.map(userId => ({
      [userId]: thisAsso.registrations[userId]
    }));
  }
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  // for each asso of this family
  const assoEvents = thisAsso.assoEvents;
  // next 3 to be obtained, in frontEnd, from assoEvents and eventsById based on current date vs
  // (for each event) registrationStart and registrationEnd,
  // through assoEvents.filter()
  const currentRegistrationEvents = ['e0'];
  // TODO don't hardcoded!
  const pastRegistrationEvents = [''];
  const futureRegistrationEvents = [''];

  // the assos of this family:
  // familyAssos = req.user.roles.parents;

  // the events of this familyId:
  // familyEvents = familyAssos.map(assoId => .assoEvents)

  // const familyEvents = {
  //   currentRegistrationEvents,
  //   pastRegistrationEvents,
  //   futureRegistrationEvents
  // }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // extract the events details from database
  // and format to normalized redux object

  // // allEvents will be built by frontend, putting together past, current and
  // // future events from all his associations, as required
  // let allEvents = [
  //   ...new Set(
  //     [].concat(
  //       thisAsso.pastRegistrationEvents,
  //       thisAsso.currentRegistrationEvents,
  //       thisAsso.futureRegistrationEvents
  //     )
  //   )
  // ];

  // currently, only one asso. So we take all the events from the database without filtering
  let eventsById = thisAsso.eventsById;
  // when several assos, we will extract from events collection all the events
  // that match our associations
  // Then we will convert from array to normalized redux object:
  // let eventsById = ourAssosEvents.reduce(function(obj, eventId) {
  //   obj[eventId] = theseEvents[eventId];
  //   return obj;
  // }, {});

  const output = {
    assos: {
      assosById,
      allAssos: req.user.roles.parent
    },
    asso: {
      id: thisAsso.id,
      contacts: thisAsso.contacts,
      eventProviderName: thisAsso.name,
      paymentPreferences: thisAsso.paymentPreferences,
      replyTo: thisAsso.replyTo,
      assoEmail: thisAsso.assoEmail,
      allItems: thisAsso.allItems,
      itemsById: thisAsso.itemsById,
      address: thisAsso.address,
      allStaff: thisAsso.allStaff,
      staffById: thisAsso.staffById
    },
    profile: {
      familyById,
      familyId: req.user.familyId,
      primaryEmail: req.user.primaryEmail,
      photoConsent: req.user.photoConsent,
      roles: req.user.roles,
      allKids: req.user.allKids,
      allParents: req.user.allParents,
      familyMedia: req.user.familyMedia,
      addresses: req.user.addresses,
      paymentReceipts: req.user.paymentReceipts,
      allEvents: req.user.allEvents,
      registeredEvents: req.user.registeredEvents,
      familyRegistrations
    },
    events: {
      eventsById,
      currentRegistrationEvents,
      pastRegistrationEvents,
      futureRegistrationEvents
    }
  };

  return output;
});

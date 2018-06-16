// this is how the redux state could look like, just after the data has been imported from the backend.
// the checkboxes object has been filtered by a backend middleware,
// to sort out for examples those names whose grade doesn't meet the class requirement.

// NB if admin changes the price of item, then will not know how much user has paid, if was before or after the change.
// Will only know that is has been successfully registered to the class -> OK
// then will need to check date of paiement, date of price change, Stripe paiement records...

// export to backend will contain users, eventId, timeStamp (calculated at time of export)

// in one go the paiement and the update to the profile are done. No need of an updated profile if you pay nothing!!

module.exports = {
  standardPrices: {
    r0: 3000,
    r1: 22500,
    r2: 45000,
    r3: 15000,
    r4: 18000,
    r5: 18000,
    r6: 10500,
    r7: 25500
  },
  discountedPrices: {
    r0: 3000,
    r1: 16500,
    r2: 39000,
    r3: 15000,
    r4: 18000,
    r5: 18000,
    r6: 10500,
    r7: 25500
  },
  discountQualifiers: ['r1', 'r2'],
  mandatoryItems: ['r0'],
  familyItems: ['r0'], // items that are charged once per family, not per kid

  // checked: {
  //   // included in export to backend
  //   idClerambault: ['r0'], // should be 'Polanski-Bush'
  //   idMulan: ['r5', 'r6'], // should be 'MulanBush'
  //   idZilan: ['r3'] // should be 'ZilanPolanski'
  // },

  // using firstName as ID for the kids, so that
  // we can add a new user in frontEnd and pay directly,
  // without waiting for a kidId by the backEnd.
  family: {
    id: 'idClerambault', // should be '6577s6rg8rgdf5rhdfbv478765789o87yt',
    name: 'Polanski-Bush',
    parents: ['DonaldBush', 'RosemaryPolanski'],
    kids: ['idMulan', 'idZilan'], // to delete
    familyMembers: {
      DonaldBush: {
        firstName: 'Donald',
        familyName: 'Bush',
        title: 'father',
        address: '123 av. des Champs Elysees, 99000 Paris',
        mobile: '060606060606',
        landlinePrivate: '050000000',
        email: 'donald@xiaoju.io'
      },
      RosemaryPolanski: {
        firstName: 'Rosemary',
        familyName: 'Polanski',
        title: 'mother',
        mobile: '06111111111',
        landlinePro: '05232423324',
        email: 'rosemary@xiaoju.io'
      },
      idMulan: {
        // should  be 'MulanBush'
        firstName: 'Mulan', // should be 'Mulan'
        familyName: 'Bush',
        kidGrade: 'CE2'
      },
      idZilan: {
        firstName: 'Zilan',
        familyName: 'Polanski',
        kidGrade: 'GS'
      }
    }
  },
  event: {
    id: 'e01', // included in export to backend
    name: 'Registration 2018-2019',
    items: ['r0', 'r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'r7'], // this sets the content and order in the page, through an Array.map()
    users: ['idClerambault', 'idMulan', 'idZilan']
  },
  items: {
    r0: {
      id: 'r0',
      name: 'Registration to the association',
      description:
        'The registration to the English Link association is required to join the activities. School year 2018-2019.',
      itemGrades: ['PS', 'MS', 'GS', 'CP', 'CE1', 'CE2', 'CM1', 'CM2']
    },
    r1: {
      id: 'r1',
      name: 'English classes in GS',
      description:
        'English Classes for bilingual kids of Grande Section. Twice 45 min a week during class time. Price includes books and other learning materials. Discount applies if minimum 2 kids of the same family do join "English classes in primary" or "English classes in GS".',
      teacherName: 'Judith Morisset',
      itemGrades: ['GS']
    },
    r2: {
      id: 'r2',
      name: 'English classes in primary',
      description:
        'English Classes for bilingual kids from CP to CM2. Adapted from the british national curriculum. 2 hours per week. 1 hour during class time plus 1 hour Thursday 15h45-16h45 for CP & CE1. During normal class time for CE2, CM1 & CM2. Price includes books and other learning materials. Discount applies if minimum 2 kids of the same family do join "English classes in primary" or "English classes in GS".',
      teacherName: '???',
      itemGrades: ['CP', 'CE1', 'CE2', 'CM1', 'CM2']
    },
    r3: {
      id: 'r3',
      name: 'Munchkin club in maternelle',
      description:
        'Fun gathering for english speakers, enjoying games, songs, activities and reading. For PS, MS & GS. Wednesday 11:00-12:00.',
      teacherName: '???',
      itemGrades: ['PS', 'MS', 'GS']
    },
    r4: {
      id: 'r4',
      name: 'Mini Kids Club',
      description:
        'Dynamic and renewed activities in english for bilingual kids. For CP & CE1. Monday 12:30-13:30.',
      teacherName: 'Judith Morisset',
      itemGrades: ['CP', 'CE1']
    },
    r5: {
      id: 'r5',
      name: 'Kids Club',
      description:
        'Dynamic and renewed activities in english for bilingual kids. For CE2, CM1 & CM2. Thursday 12:30-13:30.',
      teacherName: 'Judith Morisset',
      itemGrades: ['CE2', 'CM1', 'CM2']
    },
    r6: {
      id: 'r6',
      name: 'Bookworms',
      description:
        'The books club in english for bilingual kids. The pleasure of borrowing books and discovering stories, plus animations around books: a quiet time at the end of the week. For all ages from CP to CM2. Friday 12:30-13:30.',
      teacherName: '???',
      itemGrades: ['CP', 'CE1', 'CE2', 'CM1', 'CM2']
    },
    r7: {
      id: 'r7',
      name: 'On Stage!',
      description:
        'Theater in English for bilingual kids. A work on acting and staging, shown on stage at the end of the year. Tuesday 16:30-18:00.',
      teacherName: 'Aude d’Allest, tel.: 07 70 40 28 68',
      itemGrades: ['CP', 'CE1', 'CE2', 'CM1', 'CM2']
    }
  }
};

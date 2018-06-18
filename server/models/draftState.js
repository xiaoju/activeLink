// NB if admin changes the price of item, then will not know how much user has paid, if was before or after the change.
// Will only know that is has been successfully registered to the class -> OK
// then will need to check date of paiement, date of price change, Stripe paiement records...

// export to backend will contain users, eventId, timeStamp (calculated at time of export)

module.exports = {
  checkboxUsers: ['7jhfbasd8jfhbeas8', 'MulanBush', 'ZilanPolanski'],
  // checkboxUsers[0] is the familyId used in backend database
  // checkboxUsers.slice(1) is the kids.
  eventId: 'e0001', // included in export to backend
  eventName: 'Registration 2018-2019',
  eventContacts: ['t001', 't002'],
  allItems: ['aa00', 'aa01', 'aa02', 'aa03', 'aa04', 'aa05', 'aa06', 'aa07'],
  parents: ['DonaldBush', 'RosemaryPolanski'],
  familyEMails: [
    // 'it' like in 'this is *it*, the stuff you'be been looking for!'
    // The first one is the "main" one.
    { it: 'donald@xiaoju.io', tags: ['Donald', 'private'] },
    { it: 'rosemary@xiaoju.io', tags: ['Rosemary', 'pro'] }
  ],
  familyPhones: [
    { it: '0600000000', tags: ['mobile', 'Donald'] },
    { it: '0611111111', tags: ['mobile', 'pro', 'Rosemary'] },
    { it: '0622222222', tags: ['mobile', 'private', 'Rosemary'] },
    { it: '0633333333', tags: ['landline', 'family'] }
  ],
  standardPrices: {
    aa00: 3000,
    aa01: 22500,
    aa02: 45000,
    aa03: 15000,
    aa04: 18000,
    aa05: 18000,
    aa06: 10500,
    aa07: 25500
  },
  discountedPrices: {
    aa00: 3000,
    aa01: 16500,
    aa02: 39000,
    aa03: 15000,
    aa04: 18000,
    aa05: 18000,
    aa06: 10500,
    aa07: 25500
  },
  discountQualifiers: ['aa01', 'aa02'],
  mandatoryItems: ['aa00'],
  familyItems: ['aa00'], // items that are charged once per family, not per kid
  familyMembers: {
    // using names as IDs so that we can add a new user in frontEnd and pay
    // directly, without waiting for an id to be created by the backEnd.
    DonaldBush: {
      id: 'DonaldBush',
      firstName: 'Donald',
      familyName: 'Bush'
    },
    RosemaryPolanski: {
      id: 'RosemaryPolanski',
      firstName: 'Rosemary',
      familyName: 'Polanski'
    },
    MulanBush: {
      id: 'MulanBush',
      firstName: 'Mulan',
      familyName: 'Bush',
      kidGrade: 'CE2'
    },
    ZilanPolanski: {
      id: 'ZilanPolanski',
      firstName: 'Zilan',
      familyName: 'Polanski',
      kidGrade: 'GS'
    }
  },
  staff: {
    t001: {
      id: 't001',
      name: "Jeanne d'Arc",
      email: 'jeanne@xiaoju.io',
      phone: '04 11 111 111'
    },
    t002: {
      id: 't002',
      name: 'Simone Weil',
      email: 'simone@xiaoju.io',
      phone: '06 01 01 01 01'
    },
    t003: {
      id: 't003',
      name: 'Michelle Obama',
      email: 'michelle@xiaoju.io',
      phone: '06 06 06 06 06'
    }
  },
  items: {
    aa00: {
      id: 'r0',
      name: 'Registration to the association',
      description:
        'The registration to the English Link association is required to join the activities. School year 2018-2019.',
      itemGrades: ['PS', 'MS', 'GS', 'CP', 'CE1', 'CE2', 'CM1', 'CM2']
    },
    aa01: {
      id: 'aa01',
      name: 'English classes in GS',
      description:
        'English Classes for bilingual kids of Grande Section. Twice 45 min a week during class time. Price includes books and other learning materials. Discount applies if minimum 2 kids of the same family do join "English classes in primary" or "English classes in GS".',
      contacts: ['t001'],
      itemGrades: ['GS']
    },
    aa02: {
      id: 'aa02',
      name: 'English classes in primary',
      description:
        'English Classes for bilingual kids from CP to CM2. Adapted from the british national curriculum. 2 hours per week. 1 hour during class time plus 1 hour Thursday 15h45-16h45 for CP & CE1. During normal class time for CE2, CM1 & CM2. Price includes books and other learning materials. Discount applies if minimum 2 kids of the same family do join "English classes in primary" or "English classes in GS".',
      itemGrades: ['CP', 'CE1', 'CE2', 'CM1', 'CM2']
    },
    aa03: {
      id: 'aa03',
      name: 'Munchkin club in maternelle',
      description:
        'Fun gathering for english speakers, enjoying games, songs, activities and reading. For PS, MS & GS. Wednesday 11:00-12:00.',
      itemGrades: ['PS', 'MS', 'GS']
    },
    aa04: {
      id: 'aa04',
      name: 'Mini Kids Club',
      description:
        'Dynamic and renewed activities in english for bilingual kids. For CP & CE1. Monday 12:30-13:30.',
      contacts: ['t002'],
      itemGrades: ['CP', 'CE1']
    },
    aa05: {
      id: 'aa05',
      name: 'Kids Club',
      description:
        'Dynamic and renewed activities in english for bilingual kids. For CE2, CM1 & CM2. Thursday 12:30-13:30.',
      contacts: ['t001'],
      itemGrades: ['CE2', 'CM1', 'CM2']
    },
    aa06: {
      id: 'aa06',
      name: 'Bookworms',
      description:
        'The books club in english for bilingual kids. The pleasure of borrowing books and discovering stories, plus animations around books: a quiet time at the end of the week. For all ages from CP to CM2. Friday 12:30-13:30.',
      itemGrades: ['CP', 'CE1', 'CE2', 'CM1', 'CM2']
    },
    aa07: {
      id: 'aa07',
      name: 'On Stage!',
      description:
        'Theater in English for bilingual kids. A work on acting and staging, shown on stage at the end of the year. Tuesday 16:30-18:00.',
      contacts: ['t002', 't003'],
      itemGrades: ['CP', 'CE1', 'CE2', 'CM1', 'CM2']
    }
  }
};

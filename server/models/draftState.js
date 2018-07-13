// NB if admin changes the price of item, then will not know how much user has
// paid, if was before or after the change.
// Will only know that is has been successfully registered to the class -> OK
// then will need to check date of paiement, date of price change, Stripe
// paiement records...

module.exports = {
  eventsById: {
    e0: {
      eventId: 'e0',
      eventName: 'Registration 2018-2019',
      eventProviderName: 'English Link',
      eventContacts: ['s1', 's2'],
      bookingStartDate: '',
      bookingEndDate: '',
      allItems: ['i0', 'i1', 'i2', 'i3', 'i4', 'i5', 'i6', 'i7'],
      standardPrices: {
        i0: 3000,
        i1: 22500,
        i2: 45000,
        i3: 15000,
        i4: 18000,
        i5: 18000,
        i6: 10500,
        i7: 25500
      },
      discountedPrices: {
        i0: 3000,
        i1: 16500,
        i2: 39000,
        i3: 15000,
        i4: 18000,
        i5: 18000,
        i6: 10500,
        i7: 25500
      },
      discountQualifiers: ['i1', 'i2'],
      mandatoryItems: ['i0'],
      familyItems: ['i0'], // items that are charged once per family, not per kid
      staffById: {
        s0: {
          id: 's0',
          firstName: 'Michelle',
          familyName: 'Obama',
          name: 'Michelle Obama',
          email: 'michelle@xiaoju.io',
          phone: '06 06 06 06 06'
        },
        s1: {
          id: 's1',
          firstName: 'Jeanne',
          familyName: "d'Arc",
          name: "Jeanne d'Arc",
          email: 'jeanne@xiaoju.io',
          phone: '04 11 111 111'
        },
        s2: {
          id: 's2',
          firstName: 'Simone',
          familyName: 'Weil',
          name: 'Simone Weil',
          email: 'simone@xiaoju.io',
          phone: '06 01 01 01 01'
        },
        s3: {
          id: 's3',
          firstName: 'Jacques',
          familyName: 'Prévert',
          name: 'Jacques Prévert',
          email: 'jacques@xiaoju.io',
          phone: '06 03 03 03 03'
        }
      },
      itemsById: {
        i0: {
          id: 'i0',
          name: 'Registration to the association',
          period: '2018-2019',
          staff: ['s0'],
          description:
            'The registration to the English Link association is required to join the activities. School year 2018-2019.',
          itemGrades: ['PS', 'MS', 'GS', 'CP', 'CE1', 'CE2', 'CM1', 'CM2']
        },
        i1: {
          id: 'i1',
          name: 'English classes in GS',
          period: '2018-2019',
          staff: ['s1'],
          description:
            'English Classes for bilingual kids of Grande Section. Twice 45 min a week during class time. Price includes books and other learning materials. Discount applies if minimum 2 kids of the same family do join "English classes in primary" or "English classes in GS".',
          contacts: ['s1'],
          itemGrades: ['GS']
        },
        i2: {
          id: 'i2',
          name: 'English classes in primary',
          period: '2018-2019',
          staff: ['s2'],
          description:
            'English Classes for bilingual kids from CP to CM2. Adapted from the british national curriculum. 2 hours per week. 1 hour during class time plus 1 hour Thursday 15h45-16h45 for CP & CE1. During normal class time for CE2, CM1 & CM2. Price includes books and other learning materials. Discount applies if minimum 2 kids of the same family do join "English classes in primary" or "English classes in GS".',
          itemGrades: ['CP', 'CE1', 'CE2', 'CM1', 'CM2']
        },
        i3: {
          id: 'i3',
          name: 'Munchkin club in maternelle',
          period: '2018-2019',
          staff: ['s3'],
          description:
            'Fun gathering for english speakers, enjoying games, songs, activities and reading. For PS, MS & GS. Wednesday 11:00-12:00.',
          itemGrades: ['PS', 'MS', 'GS']
        },
        i4: {
          id: 'i4',
          name: 'Mini Kids Club',
          period: '2018-2019',
          staff: ['s0'],
          description:
            'Dynamic and renewed activities in english for bilingual kids. For CP & CE1. Monday 12:30-13:30.',
          contacts: ['s2'],
          itemGrades: ['CP', 'CE1']
        },
        i5: {
          id: 'i5',
          name: 'Kids Club',
          period: '2018-2019',
          staff: ['s2'],
          description:
            'Dynamic and renewed activities in english for bilingual kids. For CE2, CM1 & CM2. Thursday 12:30-13:30.',
          contacts: ['s1'],
          itemGrades: ['CE2', 'CM1', 'CM2']
        },
        i6: {
          id: 'i6',
          name: 'Bookworms',
          period: '2018-2019',
          staff: ['s3'],
          description:
            'The books club in english for bilingual kids. The pleasure of borrowing books and discovering stories, plus animations around books: a quiet time at the end of the week. From CP to CM2. Friday 12:30-13:30.',
          itemGrades: ['CP', 'CE1', 'CE2', 'CM1', 'CM2']
        },
        i7: {
          id: 'i7',
          name: 'On Stage!',
          period: '2018-2019',
          staff: ['s1'],
          description:
            'Theater in English for bilingual kids. A work on acting and staging, shown on stage at the end of the year. Tuesday 16:30-18:00.',
          contacts: ['s2'],
          itemGrades: ['CP', 'CE1', 'CE2', 'CM1', 'CM2']
        }
      }
    },

    familyId: '7jhfbasd8jfhbeas8',
    allKids: ['k0', 'k1'],

    allEvents: ['e0'], // ['e0'] These are the events open for registration, and not yet register by this user
    // eventsById: {
    //   e0: {
    //     id: 'e0',
    //     allItems: ['i0', 'i1', 'i2', 'i3', 'i4', 'i5', 'i6', 'i7'],
    //
    //  SEE authRoutes.js
    //   }
    // }
    allParents: ['p0', 'p1'],
    familyMedia: [
      {
        media: 'email',
        value: 'donald@xiaoju.io',
        tags: ['Donald', 'private']
      },
      { media: 'phone', value: '0600000000', tags: ['mobile', 'Donald'] }
    ],
    allRegistered: [
      // all the items that have been purchased by this family and kids
      { userId: 'family', items: [] },
      { userId: 'k0', items: [] },
      { userId: 'k1', items: [] }
    ],
    registeredById: {}, // same
    paymentsHistory: [],

    familyById: {
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
    }
  }
};

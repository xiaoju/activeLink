module.exports = {
  paymentReceipt: {
    familyName: 'Bush-Polanski',
    familyId: '7jhfbasd8jfhbeas8',
    eventId: 'e0',
    eventName: 'Registration 2018-2019',
    invoiceTotal: 112300,
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

    allKids: ['k0', 'k1', 'k2'],
    allParents: ['p0'],
    familyById: {
      k0: {
        id: 'k0',
        firstName: 'a',
        familyName: 'A',
        kidGrade: 'PS'
      },
      k1: {
        id: 'k1',
        firstName: 'b',
        familyName: 'B',
        kidGrade: 'GS'
      },
      k2: {
        id: 'k2',
        firstName: 'c',
        familyName: 'C',
        kidGrade: 'CM2'
      },
      p0: {
        id: 'p0',
        firstName: 'f',
        familyName: 'F'
      }
    },
    familyMedia: [
      {
        media: 'email',
        value: 'dfsagfdsasfgsa@dsfgfdsg.com',
        tags: ['private']
      },
      {
        media: 'phone',
        value: '12345432345432345',
        tags: ['private']
      }
    ],

    allEvents: [],
    bookedEvents: ['e0'],
    allRegisteredItems: [
      { userId: 'familyId', items: ['i0'] },
      { userId: 'k0', items: ['i4', 'i7'] },
      { userId: 'k1', items: ['i4'] }
    ],
    itemsById: {
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
  }
};

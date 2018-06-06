module.exports = {
  data: {
    users: {
      parent1: {
        id: 'parent1',
        roles: ['parent'],
        kids: ['kid1', 'kid2'],
        firstName: 'Jerome',
        familyName: 'Clerambault',
        hashedPassword: 'qwerty',
        email: 'jerome.clerambault@gmail.com',
        googleId: '105770292232398907974'
      },
      kid1: {
        id: 'kid1',
        roles: ['kid'],
        parents: ['parent1'],
        firstName: 'Mulan',
        familyName: 'Clerambault'
      },
      kid2: {
        id: 'kid2',
        roles: ['kid'],
        parents: ['parent1'],
        firstName: 'Zilan',
        familyName: 'Ning'
      },
      teacher1: {
        id: 'teacher1',
        roles: ['parent', 'teacher', 'platformMaster']
      }
    },
    schools: {},
    events: {
      e01: {
        id: 'e01',
        name: 'Registration 2018-2019',
        items: ['r1', 'r2', 'r3']
      }
    },
    items: {
      r1: {
        id: 'r1',
        name: 'Bookworms',
        tags: ['2018-2019'],
        position: 2,
        description:
          'Reading books in english, a quiet time at the end of the week... Every Friday at lunch time. First kid price is 123 EUR. Other kids pay 50 EUR.',
        priceFirstKid: 123,
        priceSecondKid: 50
      },
      r2: {
        id: 'r2',
        name: 'MiniKids',
        position: 3,
        tags: ['2018-2019']
      },
      r3: {
        id: 'r3',
        tags: ['2018-2019'],
        position: 1,
        name: 'yearly fee'
      },
      abc01: {
        id: 'abc01',
        schoolId: '1',
        vendorId: '1',
        name: 'The best workshop!',
        description: "We'll do this and that...",
        date: 'january to may, 2024',
        banner: 'some picture',
        seats: '200',
        attachments: ['pdf1', 'pdf2'],
        priceFirstKid: '10',
        priceSecondKid: '',
        priceParent: '25',
        published: '20180401',
        bookingOpening: '',
        bookingClosing: 'April 1st, 2023'
      },
      def34: {
        id: '',
        schoolId: '',
        vendorId: '',
        name: '',
        description: '',
        date: '',
        banner: '',
        seats: '',
        attachments: [],
        kidPrice: '',
        secondKidPrice: '',
        parentPrice: '',
        published: '',
        bookingOpening: '',
        bookingClosing: ''
      }
    }
  }
};

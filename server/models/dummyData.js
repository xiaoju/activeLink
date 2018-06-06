module.exports = {
  data: {
    parents: {
      parent1: {
        id: 'parent1',
        kids: ['kid1', 'kid2'],
        firstName: 'Jerome',
        familyName: 'Clerambault',
        hashedPassword: 'qwerty',
        email: 'jerome.clerambault@gmail.com',
        googleId: '105770292232398907974'
      }
    },
    kids: {
      kid1: {
        id: 'kid1',
        parents: ['parent1'],
        firstName: 'Mulan',
        familyName: 'Clerambault'
      },
      kid2: {
        id: 'kid2',
        parents: ['parent1'],
        firstName: 'Zilan',
        familyName: 'Ning'
      }
    },
    schools: {},
    events: {
      e01: {
        id: 'e01',
        name: 'Activités Péri-Scolaires 2018-2019',
        items: ['r0', 'r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'r7']
      }
    },
    items: {
      r0: {
        id: 'r0',
        name: 'Registration to the association',
        description:
          'The registration to the English Link association is required to join the activities.',
        priceFamily: 30
      },
      r1: {
        id: 'r1',
        name: 'English classes in GS',
        tags: ['2018-2019', 'class'],
        position: 1,
        grades: ['GS'],
        description:
          'English Classes for bilingual kids of Grande Section, twice 45 min a week during class time. Price includes books and other learning materials. The discounted price is applicable starting from the second kid of a same family, for the english classes in maternelle or Petit College.',
        priceFirstKid: 225,
        priceSecondKid: 165,
        teacherName: 'Judith Morisset'
      },
      r2: {
        id: 'r2',
        name: 'English classes in primary',
        tags: ['2018-2019', 'class'],
        position: 2,
        grades: ['CP', 'CE1', 'CE2', 'CM1', 'CM2'],
        description:
          'English Classes for bilingual kids of CP to CM2. Adapted from the british national curriculum. 2 hours per week. CP & CE1 : 1 hour during class time + 1 hour Thursday 15h45 to 16h45. CE2,CM1 & CM2 : during normal class time. Price includes books and other learning materials. The discounted price is applicable starting from the second kid of a same family, for the english classes in maternelle or Petit College.',
        priceFirstKid: 450,
        priceSecondKid: 390,
        teacherName: '???'
      },
      r3: {
        id: 'r3',
        name: 'Munchkin club in maternelle',
        tags: ['2018-2019', 'club'],
        position: 3,
        grades: ['PS', 'MS', 'GS'],
        description:
          'Fun gathering for english speakers, enjoying games, songs, activities and reading. For the kids in maternelle (PS, MS, GS). 1 hour per week, on Wednesday from 11:00 to 12:00.',
        priceFirstKid: 150,
        teacherName: '???'
      },
      r4: {
        id: 'r4',
        name: 'Mini Kids Club',
        tags: ['2018-2019', 'club'],
        position: 4,
        grades: ['CP', 'CE1'],
        description:
          'Dynamic and renewed activities in english for bilingual kids. The pleasure of borrowing books and discovering stories, plus animations around books. A quiet time at the end of the week for all ages from CP to CM2. Monday 12:30-13:30.',
        priceFirstKid: 180,
        teacherName: 'Judith Morisset'
      },
      r5: {
        id: 'r5',
        name: 'Kids Club',
        tags: ['2018-2019', 'club'],
        position: 5,
        grades: ['CE2', 'CM1', 'CM2'],
        description:
          'Dynamic and renewed activities in english for bilingual kids. The pleasure of borrowing books and discovering stories, plus animations around books. A quiet time at the end of the week for all ages from CP to CM2. Thursday 12:30-13:30.',
        priceFirstKid: 180,
        teacherName: 'Judith Morisset'
      },
      r6: {
        id: 'r6',
        name: 'Bookworms',
        tags: ['2018-2019', 'club'],
        position: 6,
        grades: ['CP', 'CE1', 'CE2', 'CM1', 'CM2'],
        description:
          'The books club in english for bilingual kids. The pleasure of borrowing books and discovering stories, plus animations around books. A quiet time at the end of the week for all ages from CP to CM2. Friday 12:30-13:30.',
        priceFirstKid: 105,
        teacherName: '???'
      },
      r7: {
        id: 'r7',
        name: 'On Stage!',
        tags: ['2018-2019', 'theater'],
        position: 7,
        grades: ['CP', 'CE1', 'CE2', 'CM1', 'CM2'],
        description:
          'Theater in English for bilingual kids. Work on acting and staging, shown on stage at the end of the year. Tuesday 16:30-18:00.',
        priceFirstKid: 255,
        teacherName: 'Aude d’Allest, tel.: 07 70 40 28 68'
      }
      // abc01: {
      //   id: 'abc01',
      //   schoolId: '1',
      //   vendorId: '1',
      //   name: 'The best workshop!',
      //   description: "We'll do this and that...",
      //   date: 'january to may, 2024',
      //   banner: 'some picture',
      //   seats: '200',
      //   attachments: ['pdf1', 'pdf2'],
      //   priceFirstKid: '10',
      //   priceSecondKid: '',
      //   priceParent: '25',
      //   published: '20180401',
      //   bookingOpening: '',
      //   bookingClosing: 'April 1st, 2023'
      // },
      // def34: {
      //   id: '',
      //   schoolId: '',
      //   vendorId: '',
      //   name: '',
      //   description: '',
      //   date: '',
      //   banner: '',
      //   seats: '',
      //   attachments: [],
      //   kidPrice: '',
      //   secondKidPrice: '',
      //   parentPrice: '',
      //   published: '',
      //   bookingOpening: '',
      //   bookingClosing: ''
      // }
    }
  }
};

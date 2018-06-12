// this is how the redux state could look like, just after the data has been imported from the backend.
// the checkboxes object has been filtered by a backend middleware,
// to sort out for examples those names whose grade doesn't meet the class requirement.

// NB if admin changes the price of item, then will not know how much user has paid, if was before or after the change.
// Will only know that is has been successfully registered to the class -> OK
// then will need to check date of paiement, date of price change, Stripe paiement records...

// export to backend will contain users, eventId, timeStamp (calculated at time of export)

module.exports = {
  checked: {
    // included in export to backend
    idClerambault: ['r0'],
    idMulan: ['r5', 'r6'],
    idZilan: ['r3']
  },
  users: {
    // not in same level as events.id/name/etc , so that we can cycle through without knowing the names of the people. then in separate object to reduce nesting levels
    idClerambault: {
      id: 'idClerambault',
      label: 'Clerambault',
      items: ['r0']
      // checked: ['r0']
    },
    idMulan: {
      id: 'idMulan',
      label: 'Mulan',
      items: ['r2', 'r5', 'r6', 'r7']
      // checked: ['r5', 'r6']
    },
    idZilan: {
      id: 'idZilan',
      label: 'Zilan',
      items: ['r1', 'r3', 'r6']
      // checked: ['r3']
    }
  },
  event: {
    id: 'e01', // included in export to backend
    name: 'Registration 2018-2019',
    items: ['r0', 'r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'r7'], // this sets the content and order in the page, through an Array.map()
    users: ['idClerambault', 'idMulan', 'idZilan'],
    instructions: [
      // 'First please update your profile (name of kids, grades in this new year, etc) by clicking onto the top right button.',
      // "After your profile is up-to-date, you can select the activities for each of your kids, below in this page. Note that some activities are restricted to specific grades (CP, CE1, etc.). If your kid's grade doesn't match the required grade for the activity, then the checkbox with your kid s'name won't appear under this activity.",
      // "Finally, confirm registration by paying with the orange button on top of this page. ",
      // 'Any questions? You can contact Catherine Souchard per phone: 06 32 54 91 62 or email: contactsecretary@englishlink.fr'
    ]
    // total: 3000 // calculated by client to show on page, but not sent to backend
  },
  items: {
    r0: {
      id: 'r0',
      name: 'Registration to the association',
      description:
        'The registration to the English Link association is required to join the activities. School year 2018-2019.',
      priceFamily: 3000,
      mandatory: true
    },
    r1: {
      id: 'r1',
      name: 'English classes in GS',
      description:
        'English Classes for bilingual kids of Grande Section. Twice 45 min a week during class time. Price includes books and other learning materials. The discounted price is applicable to all kids of a family, as soon as 2 or more of them join the english classes: "English classes in primary" or "English classes in GS".',
      priceFirstKid: 22500,
      priceSecondKid: 16500,
      teacherName: 'Judith Morisset'
    },
    r2: {
      id: 'r2',
      name: 'English classes in primary',
      description:
        'English Classes for bilingual kids from CP to CM2. Adapted from the british national curriculum. 2 hours per week. 1 hour during class time plus 1 hour Thursday 15h45-16h45 for CP & CE1. During normal class time for CE2, CM1 & CM2. Price includes books and other learning materials. The discounted price is applicable to all kids of a family, as soon as 2 or more of them join the english classes: "English classes in primary" or "English classes in GS".',
      priceFirstKid: 45000,
      priceSecondKid: 39000,
      teacherName: '???'
    },
    r3: {
      id: 'r3',
      name: 'Munchkin club in maternelle',
      description:
        'Fun gathering for english speakers, enjoying games, songs, activities and reading. For PS, MS & GS. Wednesday 11:00-12:00.',
      priceFirstKid: 15000,
      teacherName: '???'
    },
    r4: {
      id: 'r4',
      name: 'Mini Kids Club',
      description:
        'Dynamic and renewed activities in english for bilingual kids. For CP & CE1. Monday 12:30-13:30.',
      priceFirstKid: 18000,
      teacherName: 'Judith Morisset'
    },
    r5: {
      id: 'r5',
      name: 'Kids Club',
      description:
        'Dynamic and renewed activities in english for bilingual kids. For CE2, CM1 & CM2. Thursday 12:30-13:30.',
      priceFirstKid: 18000,
      teacherName: 'Judith Morisset'
    },
    r6: {
      id: 'r6',
      name: 'Bookworms',
      description:
        'The books club in english for bilingual kids. The pleasure of borrowing books and discovering stories, plus animations around books: a quiet time at the end of the week. For all ages from CP to CM2. Friday 12:30-13:30.',
      priceFirstKid: 10500,
      teacherName: '???'
    },
    r7: {
      id: 'r7',
      name: 'On Stage!',
      description:
        'Theater in English for bilingual kids. Work on acting and staging, shown on stage at the end of the year. Tuesday 16:30-18:00.',
      priceFirstKid: 25500,
      teacherName: 'Aude d’Allest, tel.: 07 70 40 28 68'
    }
  }
};

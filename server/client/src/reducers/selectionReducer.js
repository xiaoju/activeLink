import { REVIEW_ORDER, LOAD_DATA } from '../actions/types';

export default function(state = null, action) {
  switch (action.type) {
    case REVIEW_ORDER:
      return action.payload;

    case LOAD_DATA:
      return state;

    default:
      return state;
  }
}

// input is:
// items: {
//   r0: {
//     id: 'r0',
//     name: 'Re
//
//
//
//
// Object.keys(action.data.data.items).map((thisItem) => (thisItem.id))
// -->  [r0, r1, r2, r3, ..., r7]

// output should be:
// {total: 3000,
//   kid1: {r1: false,r2: false,r3: false,r4: false,r5: false,r6: false,r7: false},
//   kid2: {r1: false,r2: false,r3: false,r4: false,r5: false,r6: false,r7: false},
// }
//      return action.payload. || '';

// or could be:

// {total: 3000,
//   parent1: {r0: true},
//   kid1: {r1: false,r2: false,r3: false,r4: false,r5: false,r6: false,r7: false},
//   kid2: {r1: false,r2: false,r3: false,r4: false,r5: false,r6: false,r7: false},
// }

// or could be

//   r0: {parent1: true},
//   r1: {kid1: false, kid2: false},
//   r2: {kid1: false, kid2: false},

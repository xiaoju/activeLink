// export qualifiedForDiscount () => 'abc';

// export const qualifiedForDiscount = input => input + 2;
//
// export const qualifiedForDiscount2 = () => 3 + 2;

// export const total = ({ checked, data }) => (
//   A = 'abc'
//   checked.idClerambault[0] + data.event.id
// );

export let applyDiscount = letsApplyDiscount({
  // a constant, either true or false
  checked: { first: 'j' },
  data: { second: 'j' }
});

function letsApplyDiscount({ checked, data }) {
  let isTheSame = checked.first === data.second;
  return isTheSame;
}

export function total({ checked, data }) {
  let A = letsApplyDiscount({ checked, data }) && 'abc';
  // let A = applyDiscount && 'abc';

  return A;
}

// let theTotal = 3 + 4;
// let theTotal = 3 + 4;
//
// costOfThisItem: this.props.data[thisItem]
//
// Object.keys(this.props.users)     // list of users
//
//   cycle through users and items
//     'through users': Object.keys(this.props.users)
//     'through items for thisUser':
//
//   CostThisUserThisItem(thisUser, thisItem) =
//
//   anArrayOfCosts =
//
//   [anArrayOfCosts].reduce(
//     ( accumulator, thisThingCost ) => accumulator + thisThingCost,
//     0
//   )
//
//   var total = [ 0, 1, 2, 3 ].reduce(
//     ( accumulator, currentValue ) => accumulator + currentValue,
//     0
//   );

// import React, { Component } from 'react';
// import { connect } from 'react-redux';
//
// class ComputeDiscount extends Component {
//   render() {
//     return <h4>
//       {Object.keys(this.props.checked).map(thisUserId => (
//         <p>{this.props.checked[thisUserId]}</p>
//       ))}
//     </h4>
//   }
// }
//
// function mapStateToProps({ checked }) {
//   return { checked };
// }
//
// export default connect(mapStateToProps)(ComputeDiscount);

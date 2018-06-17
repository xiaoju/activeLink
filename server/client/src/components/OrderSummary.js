import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  getCheckedItemsNoDoublons,
  getCheckedItems,
  getApplyDiscount,
  getDiscountQualifiers,
  getChecked,
  getItemsPerId,
  getCheckboxUsers,
  getStandardPrices,
  getDiscountedPrices,
  getFamilyName,
  getTotal,
  getFamilyMembers
} from '../selectors';

class OrderSummary extends Component {
  render() {
    const {
      filteredItems,
      checkedItems,
      applyDiscount,
      discountQualifiers,
      checked,
      itemsPerId,
      checkboxUsers,
      standardPrices,
      discountedPrices,
      familyName,
      total,
      familyMembers
    } = this.props;

    let quantity = itemId => checkedItems.filter(x => x === itemId).length;

    let unitPrice = itemId =>
      (applyDiscount ? discountedPrices[itemId] : standardPrices[itemId]) / 100;

    let subTotal = itemId => quantity(itemId) * unitPrice(itemId);

    let kidNames = itemId =>
      checkboxUsers
        .slice(1)
        .filter(userId => checked[userId].includes(itemId)) // TODO
        .map(userId => familyMembers[userId].firstName)
        .join(', ');

    let discountNotice = itemId =>
      applyDiscount &&
      discountQualifiers.includes(itemId) &&
      'Discount applied. ';

    return (
      <div className="itemsContainer hoverable">
        <h4 className="stepTitle">③ Review your order</h4>
        <div className="container orderSummary">
          {filteredItems.map(itemId => (
            <p>
              <strong>{itemsPerId[itemId].name}</strong>
              <br />
              <span>
                {quantity(itemId)} x {unitPrice(itemId)} = {subTotal(itemId)}{' '}
                &euro; {kidNames(itemId)}
                {discountNotice(itemId)}
              </span>
            </p>
          ))}

          <p>Total: {total / 100} &euro;</p>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    filteredItems: getCheckedItemsNoDoublons(state),
    checkedItems: getCheckedItems(state),
    applyDiscount: getApplyDiscount(state),
    discountQualifiers: getDiscountQualifiers(state),
    checked: getChecked(state),
    itemsPerId: getItemsPerId(state),
    checkboxUsers: getCheckboxUsers(state),
    standardPrices: getStandardPrices(state),
    discountedPrices: getDiscountedPrices(state),
    familyName: getFamilyName(state),
    total: getTotal(state),
    familyMembers: getFamilyMembers(state)
  };
}

export default connect(mapStateToProps)(OrderSummary);

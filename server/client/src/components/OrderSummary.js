import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  getCheckedItemsNoDoublons,
  getCheckedItems,
  getApplyDiscount,
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
      checked,
      itemsPerId,
      checkboxUsers,
      standardPrices,
      discountedPrices,
      familyName,
      total,
      familyMembers
    } = this.props;

    return (
      <div className="itemsContainer hoverable">
        <h4 className="stepTitle">③ Review your order</h4>
        <div className="container orderSummary">
          {filteredItems.map(itemId => (
            <div>
              <p>{itemsPerId[itemId].name}</p>
              <p>quantity: {checkedItems.filter(x => x === itemId).length}</p>
            </div>
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

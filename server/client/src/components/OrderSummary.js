import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  getCheckedItemsNoDoublons,
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
          {filteredItems.map(itemId => <p>{itemsPerId[itemId].name}</p>)}

          <p>Total: {total / 100} &euro;</p>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    filteredItems: getCheckedItemsNoDoublons(state),
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

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
  // getMergedFamilyName,
  getTotal,
  getFamilyPerId
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
      // mergedFamilyName,
      total,
      familyPerId
    } = this.props;

    let quantity = itemId => checkedItems.filter(x => x === itemId).length;

    let unitPrice = itemId =>
      (applyDiscount ? discountedPrices[itemId] : standardPrices[itemId]) / 100;

    let subTotal = itemId => quantity(itemId) * unitPrice(itemId);

    let kidNames = itemId =>
      checkboxUsers
        .slice(1)
        .filter(userId => checked[userId].includes(itemId))
        .map(userId => familyPerId[userId].firstName)
        .join(' & ');

    let discountNotice = itemId =>
      applyDiscount && discountQualifiers.includes(itemId) && 'yes';

    return (
      <div className="itemsContainer hoverable">
        <h4 className="stepTitle">③ Review your order</h4>
        <div className="container orderSummary">
          <table className="striped centered responsive-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Kids</th>
                <th>Discount</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map(itemId => (
                <tr key={itemId}>
                  <td>
                    <strong>{itemsPerId[itemId].name}</strong>
                  </td>
                  <td>{quantity(itemId)}</td>
                  <td>{kidNames(itemId)}</td>
                  <td>{discountNotice(itemId)}</td>
                  <td>{unitPrice(itemId)}</td>
                  <td>{subTotal(itemId)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <th colSpan="5">Total :</th>
                <td>
                  <strong>{total / 100}&nbsp;&euro;</strong>
                </td>
              </tr>
            </tfoot>
          </table>
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
    // mergedFamilyName: getMergedFamilyName(state),
    total: getTotal(state),
    familyPerId: getFamilyPerId(state)
  };
}

export default connect(mapStateToProps)(OrderSummary);

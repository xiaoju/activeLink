import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  getFamilyId,
  getAllItems,
  getCheckedItemsNoDoublons,
  getCheckedItems,
  getApplyDiscount,
  getDiscountQualifiers,
  getChecked,
  getItemsById,
  getFamilyAndValidKids,
  getStandardPrices,
  getDiscountedPrices,
  getTotal,
  getFamilyById
} from '../selectors';

class OrderSummary extends Component {
  render() {
    const {
      familyId,
      classItems,
      checkedItemsNoDoublons,
      checkedItems,
      applyDiscount,
      discountQualifiers,
      checked,
      itemsById,
      familyAndValidKids,
      standardPrices,
      discountedPrices,
      total,
      familyById
    } = this.props;

    let quantity = itemId => checkedItems.filter(x => x === itemId).length;

    let unitPrice = itemId =>
      (applyDiscount ? discountedPrices[itemId] : standardPrices[itemId]) / 100;

    let subTotal = itemId => quantity(itemId) * unitPrice(itemId);

    let kidNames = itemId =>
      familyAndValidKids // ['familyId','k0', 'k1' ]
        .slice(1) // ['k0', 'k1']
        .filter(userId => checked[userId].includes(itemId))
        .map(userId => familyById[userId].firstName)
        .join(' & ');

    let discountNotice = itemId =>
      applyDiscount && discountQualifiers.includes(itemId) && 'yes';

    let filteredItems = checkedItemsNoDoublons.filter(itemId =>
      classItems.includes(itemId)
    );

    return (
      <div className="itemsContainer hoverable">
        <h4 className="stepTitle">⑤ Review your order</h4>
        <div className="orderSummary" style={{ margin: '2%' }}>
          {/* Profile section */}
          <h5>- Profile -</h5>
          <br />

          {/* Classes section */}
          <h5>- Selected classes -</h5>

          <table className="striped centered">
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
                    <strong>{itemsById[itemId].name}</strong>
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
                <th colSpan="5">Total (for 1 year) :</th>
                <td>
                  <strong>{total / 100}&nbsp;&euro;</strong>
                </td>
              </tr>
            </tfoot>
          </table>

          {/* Consent section */}

          <h5>- Photo & Video Consent -</h5>
          {checked[familyId].includes('i21') ? (
            <p>Photos are OK!</p>
          ) : (
            <p>No pictures please!</p>
          )}

          {/* Volunteering section */}

          <h5>- Volunteering -</h5>
          <span>
            <strong>I don't want to support.</strong>

            <strong>
              Thank you for your support! We will call you back regarding
              following tasks:
            </strong>
          </span>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    familyId: getFamilyId(state),
    classItems: getAllItems(state),
    checkedItemsNoDoublons: getCheckedItemsNoDoublons(state),
    checkedItems: getCheckedItems(state),
    applyDiscount: getApplyDiscount(state),
    discountQualifiers: getDiscountQualifiers(state),
    checked: getChecked(state),
    itemsById: getItemsById(state),
    familyAndValidKids: getFamilyAndValidKids(state),
    standardPrices: getStandardPrices(state),
    discountedPrices: getDiscountedPrices(state),
    total: getTotal(state),
    familyById: getFamilyById(state)
  };
}

export default connect(mapStateToProps)(OrderSummary);

import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  getPhotoConsent,
  getPrimaryEmail,
  getVolunteeringItems,
  getIsVolunteering,
  getEventProviderName,
  getValidParents,
  getValidKids,
  getValidFamilyById,
  getValidAddresses,
  getValidMedia,
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
      photoConsent,
      primaryEmail,
      sectionTitle,
      volunteeringItems,
      isVolunteering,
      eventProviderName,
      validParents,
      validKids,
      validFamilyById,
      validAddresses,
      validMedia,
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
        <h4 className="stepTitle">{sectionTitle}</h4>
        <div className="orderSummary" style={{ margin: '2%' }}>
          {/* Profile section */}
          <h5>- ➊ Profile -</h5>
          <h6>
            <strong>Parents: </strong>
          </h6>
          <ul>
            {validParents.map(userId => (
              <li key={userId}>
                {validFamilyById[userId].firstName}{' '}
                {validFamilyById[userId].familyName}
              </li>
            ))}
          </ul>
          <h6>
            <strong>Kids: </strong>
          </h6>
          <ul>
            {validKids.map(userId => (
              <li key={userId}>
                {validFamilyById[userId].firstName}{' '}
                {validFamilyById[userId].familyName}
                {', '}
                {validFamilyById[userId].kidGrade}
              </li>
            ))}
          </ul>
          <h6>
            <strong>Postal addresses: </strong>
          </h6>
          <ul>
            {validAddresses.map((addressObject, index) => (
              <li key={index}>
                <strong>
                  {addressObject.tags.map((tag, index) => (
                    <span key={index}>{tag} </span>
                  ))}:{' '}
                </strong>
                {addressObject.value}
              </li>
            ))}
          </ul>
          <h6>
            <strong>Phones and emails: </strong>
          </h6>
          <ul>
            <li key="primaryEmail">
              <strong>Primary email (used for sign-in): </strong>
              {primaryEmail}
            </li>
            {validMedia.map((mediaObject, index) => (
              <li key={index}>
                <strong>
                  {mediaObject.tags.map((tag, index) => (
                    <span key={index}>{tag} </span>
                  ))}:{' '}
                </strong>
                {mediaObject.value}
              </li>
            ))}
          </ul>
          <br />
          {/* Classes section */}
          <h5>- ➋ Selected classes -</h5>
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
          {/* Volunteering section */}
          <h5>- ➌ Volunteering -</h5>

          {isVolunteering ? (
            <span>
              Thank you for your support! We'll contact you regarding following
              tasks:
            </span>
          ) : (
            <ul>
              <li>I don't support {eventProviderName}.</li>
              <div className="card-panel validationMessage">
                <p>
                  Really, could you please support {eventProviderName} and
                  co-organize one of the events?
                  <br /> <strong>Select a task in section ③ above,</strong>
                  <br />we'll call you back and accompany you.
                </p>
              </div>
            </ul>
          )}
          <ul>
            {isVolunteering &&
              volunteeringItems
                .filter(itemId => checked[familyId].includes(itemId))
                .sort((i0, i1) => i0.substring(1) - i1.substring(1))
                .map(itemId => (
                  <li key={itemId}>
                    <strong>{itemsById[itemId].name}</strong>
                    <br />
                  </li>
                ))}
          </ul>
          {/* Consent section */}
          <h5>- ➍ Photo & Video Consent -</h5>
          {photoConsent ? (
            <p>OK for pictures of my children!</p>
          ) : (
            <p>No pictures of my children please!</p>
          )}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    photoConsent: getPhotoConsent(state),
    primaryEmail: getPrimaryEmail(state),
    volunteeringItems: getVolunteeringItems(state),
    isVolunteering: getIsVolunteering(state),
    eventProviderName: getEventProviderName(state),
    validParents: getValidParents(state),
    validKids: getValidKids(state),
    validFamilyById: getValidFamilyById(state),
    validAddresses: getValidAddresses(state),
    validMedia: getValidMedia(state),
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

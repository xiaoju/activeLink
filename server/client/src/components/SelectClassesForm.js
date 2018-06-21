import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { uncheckCheckbox, checkCheckbox } from '../actions/index';
import ItemCheckboxes from './ItemCheckboxes';
import ItemPrices from './ItemPrices';
import {
  getApplyDiscount,
  getChecked,
  getMergedFamilyName,
  getFamilyPerId,
  getFamilyItems,
  getAllItems,
  getItemsPerId,
  getMandatoryItems,
  getCheckboxUsers,
  getStandardPrices,
  getDiscountedPrices
} from '../selectors';

class SelectClassesForm extends Component {
  render() {
    const {
      allItems,
      itemsPerId,
      familyItems,
      mergedFamilyName,
      familyPerId,
      checked,
      checkCheckbox,
      uncheckCheckbox,
      mandatoryItems,
      checkboxUsers,
      standardPrices,
      discountedPrices
    } = this.props;

    return (
      <div className="itemsContainer hoverable">
        <h4 className="stepTitle">② Select classes for your kids</h4>
        {allItems &&
          allItems.map((thisItemId, i) => (
            <div className="container itemDetails" key={thisItemId}>
              {/* Name of the class */}
              <h5>
                <strong>{itemsPerId[thisItemId].name}</strong>
              </h5>
              {/* Description of the class */}
              <div>{itemsPerId[thisItemId].description}</div>
              {/* Teacher name */}
              {itemsPerId[thisItemId].teacherName && (
                <div>Animated by {itemsPerId[thisItemId].teacherName}</div>
              )}

              <ItemPrices
                itemId={thisItemId}
                familyItems={familyItems}
                standardPrices={standardPrices}
                discountedPrices={discountedPrices}
              />

              <ItemCheckboxes
                itemId={thisItemId}
                itemsPerId={itemsPerId}
                familyItems={familyItems}
                mergedFamilyName={mergedFamilyName}
                familyPerId={familyPerId}
                checked={checked}
                checkCheckbox={checkCheckbox}
                uncheckCheckbox={uncheckCheckbox}
                mandatoryItems={mandatoryItems}
                checkboxUsers={checkboxUsers}
              />
            </div>
          ))}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    applyDiscount: getApplyDiscount(state),
    checked: getChecked(state),
    mergedFamilyName: getMergedFamilyName(state),
    familyPerId: getFamilyPerId(state),
    familyItems: getFamilyItems(state),
    allItems: getAllItems(state),
    itemsPerId: getItemsPerId(state),
    mandatoryItems: getMandatoryItems(state),
    checkboxUsers: getCheckboxUsers(state),
    standardPrices: getStandardPrices(state),
    discountedPrices: getDiscountedPrices(state)
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      checkCheckbox: checkCheckbox,
      uncheckCheckbox: uncheckCheckbox
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectClassesForm);

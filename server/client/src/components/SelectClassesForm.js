import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { uncheckCheckbox, checkCheckbox } from '../actions/index';
import ItemCheckboxes from './ItemCheckboxes';
import ItemPrices from './ItemPrices';
import {
  getStaffPerId,
  getApplyDiscount,
  getChecked,
  getMergedFamilyName,
  getFamilyPerId,
  getFamilyItems,
  getAllItems,
  getItemsPerId,
  getMandatoryItems,
  getFamilyId,
  getStandardPrices,
  getDiscountedPrices,
  getValidKids
} from '../selectors';

class SelectClassesForm extends Component {
  render() {
    const {
      staffPerId,
      allItems,
      itemsPerId,
      familyItems,
      mergedFamilyName,
      familyPerId,
      checked,
      checkCheckbox,
      uncheckCheckbox,
      mandatoryItems,
      familyId,
      standardPrices,
      discountedPrices,
      validKids
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
              {itemsPerId[thisItemId].staff && (
                <div>
                  Animated by{' '}
                  {staffPerId[itemsPerId[thisItemId].staff[0]].firstName}{' '}
                  {staffPerId[itemsPerId[thisItemId].staff[0]].familyName}.
                </div>
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
                familyId={familyId}
                validKids={validKids}
              />
            </div>
          ))}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    staffPerId: getStaffPerId(state),
    applyDiscount: getApplyDiscount(state),
    checked: getChecked(state),
    mergedFamilyName: getMergedFamilyName(state),
    familyPerId: getFamilyPerId(state),
    familyItems: getFamilyItems(state),
    allItems: getAllItems(state),
    itemsPerId: getItemsPerId(state),
    mandatoryItems: getMandatoryItems(state),
    familyId: getFamilyId(state),
    standardPrices: getStandardPrices(state),
    discountedPrices: getDiscountedPrices(state),
    validKids: getValidKids(state)
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

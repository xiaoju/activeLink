import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { uncheckCheckbox, checkCheckbox } from '../actions/index';
import ItemCheckboxes from './ItemCheckboxes';
import ItemPrices from './ItemPrices';
import {
  getStaffById,
  getApplyDiscount,
  getChecked,
  getMergedFamilyName,
  getFamilyById,
  getFamilyItems,
  getAllItems,
  getItemsById,
  getMandatoryItems,
  getFamilyId,
  getStandardPrices,
  getDiscountedPrices,
  getValidKids
} from '../selectors';

class SelectClassesForm extends Component {
  render() {
    const {
      sectionTitle,
      staffById,
      allItems,
      itemsById,
      familyItems,
      mergedFamilyName,
      familyById,
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
        <h4 className="stepTitle">{sectionTitle}</h4>
        {allItems &&
          allItems.map((thisItemId, i) => (
            <div className="container itemDetails" key={thisItemId}>
              {/* Name of the class */}
              <h5>
                <strong>{itemsById[thisItemId].name}</strong>
              </h5>
              {/* Description of the class */}
              <div>{itemsById[thisItemId].description}</div>
              {/* Teacher name */}
              {itemsById[thisItemId].staff && (
                <div>
                  Animated by{' '}
                  {staffById[itemsById[thisItemId].staff[0]].firstName}{' '}
                  {staffById[itemsById[thisItemId].staff[0]].familyName}.
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
                itemsById={itemsById}
                familyItems={familyItems}
                mergedFamilyName={mergedFamilyName}
                familyById={familyById}
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
    staffById: getStaffById(state),
    applyDiscount: getApplyDiscount(state),
    checked: getChecked(state),
    mergedFamilyName: getMergedFamilyName(state),
    familyById: getFamilyById(state),
    familyItems: getFamilyItems(state),
    allItems: getAllItems(state),
    itemsById: getItemsById(state),
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

SelectClassesForm.propTypes = {
  sectionTitle: PropTypes.string.isRequired,
  sectionInstructions: PropTypes.string
  // TODO
};

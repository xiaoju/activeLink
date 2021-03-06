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
import PageSection from './layout/PageSection';

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
      <PageSection sectionTitle={sectionTitle}>
        {allItems &&
          allItems.map((itemId, i) => (
            <div className="container itemDetails" key={itemId}>
              {/* Name of the class */}
              <h5>
                <strong>{itemsById[itemId].name}</strong>
              </h5>
              {/* Description of the class */}
              <div>{itemsById[itemId].description}</div>
              {/* Teacher name(s) */}
              {itemsById[itemId].staff && (
                <div>
                  Animated by{' '}
                  {itemsById[itemId].staff
                    .map(
                      staffId =>
                        staffById[staffId].firstName +
                        ' ' +
                        staffById[staffId].familyName
                    )
                    .join(' & ')}.
                </div>
              )}

              <ItemPrices
                itemId={itemId}
                familyItems={familyItems}
                standardPrices={standardPrices}
                discountedPrices={discountedPrices}
              />

              <ItemCheckboxes
                itemId={itemId}
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
      </PageSection>
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

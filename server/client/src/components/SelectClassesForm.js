import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { uncheckCheckbox, checkCheckbox } from '../actions/index';
import ItemCheckboxes from './ItemCheckboxes';
import ItemPrices from './ItemPrices';
import {
  getApplyDiscount,
  getChecked,
  getFamilyName,
  getFamilyMembers,
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
    return (
      <div className="itemsContainer hoverable">
        <h4 className="stepTitle">② Select classes for your kids</h4>
        {this.props.allItems &&
          this.props.allItems.map((thisItemId, i) => (
            <div className="container itemDetails" key={thisItemId}>
              {/* Name of the class */}
              <h5>
                <strong>{this.props.items[thisItemId].name}</strong>
              </h5>
              {/* Description of the class */}
              <div>{this.props.items[thisItemId].description}</div>
              {/* Teacher name */}
              {this.props.items[thisItemId].teacherName && (
                <div>
                  Animated by {this.props.items[thisItemId].teacherName}
                </div>
              )}

              <ItemPrices
                itemId={thisItemId}
                familyItems={this.props.familyItems}
                standardPrices={this.props.standardPrices}
                discountedPrices={this.props.discountedPrices}
              />

              <ItemCheckboxes
                itemId={thisItemId}
                items={this.props.items}
                familyItems={this.props.familyItems}
                familyName={this.props.familyName}
                familyMembers={this.props.familyMembers}
                checked={this.props.checked}
                checkCheckbox={this.props.checkCheckbox}
                uncheckCheckbox={this.props.uncheckCheckbox}
                mandatoryItems={this.props.mandatoryItems}
                checkboxUsers={this.props.checkboxUsers}
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
    familyName: getFamilyName(state),
    familyMembers: getFamilyMembers(state),
    familyItems: getFamilyItems(state),
    allItems: getAllItems(state),
    items: getItemsPerId(state),
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

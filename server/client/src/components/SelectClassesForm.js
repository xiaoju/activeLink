import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { uncheckCheckbox, checkCheckbox } from '../actions/index';
import ItemCheckboxes from './ItemCheckboxes';
import ItemPrices from './ItemPrices';
import { getApplyDiscount, getChecked } from '../selectors';

class SelectClassesForm extends Component {
  render() {
    return (
      <div className="itemsContainer">
        <h4 className="stepTitle">② Select classes for your kids</h4>
        {this.props.data &&
          this.props.data.event.items.map((thisItemId, i) => (
            <div className="container itemDetails" key={thisItemId}>
              {/* Name of the class */}
              <h5>
                <strong>{this.props.data.items[thisItemId].name}</strong>
              </h5>
              {/* Description of the class */}
              <div>{this.props.data.items[thisItemId].description}</div>
              {/* Teacher name */}
              {this.props.data.items[thisItemId].teacherName && (
                <div>
                  Animated by {this.props.data.items[thisItemId].teacherName}
                </div>
              )}

              <ItemPrices
                itemId={thisItemId}
                familyItems={this.props.data.familyItems}
                standardPrices={this.props.data.standardPrices}
                discountedPrices={this.props.data.discountedPrices}
              />

              <ItemCheckboxes
                itemId={thisItemId}
                items={this.props.data.items}
                familyItems={this.props.data.familyItems}
                familyId={[this.props.data.family.id]}
                familyName={this.props.data.family.name}
                familyMembers={this.props.data.family.familyMembers}
                kids={this.props.data.family.kids}
                checked={this.props.checked}
                checkCheckbox={this.props.checkCheckbox}
                uncheckCheckbox={this.props.uncheckCheckbox}
                mandatoryItems={this.props.data.mandatoryItems}
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
    data: state.data
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

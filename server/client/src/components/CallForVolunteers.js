import React, { Component } from 'react';
import { connect } from 'react-redux';
import { uncheckCheckbox, checkCheckbox } from '../actions/index';
import { bindActionCreators } from 'redux';
import {
  getVolunteeringItems,
  getChecked,
  getFamilyId,
  getItemsById
} from '../selectors';
// import PropTypes from 'prop-types';

class CallForVolunteers extends Component {
  render() {
    const {
      volunteeringItems,
      familyId,
      checked,
      checkCheckbox,
      uncheckCheckbox,
      itemsById
    } = this.props;

    return (
      <div className="itemsContainer hoverable">
        <h4 className="stepTitle">④ Call for Volunteers!</h4>
        <div className="container itemDetails">
          <p>
            Without support by parents, The English Link may need to scale back
            activities. Please tick some boxes below and we'll call you back.
          </p>
        </div>
        <div className="container itemDetails">
          <p>
            We are looking for 2 bureau members for the positions of{' '}
            <strong>Logistics Coordinators</strong>.<br />The Bureau meets once
            a month in the evening to manage and plan activities. Meetings are
            held at the homes of the bureau members on a rotating basis.<br />The{' '}
            <strong>Logistics Coordinator</strong> leads the organization of the
            3 workshops (fall, spring, summer), reserves the venues and leads
            the planning for the Christmas party and "Annual General Meeting /
            Garden Party", coordinates tickets for the pantomime, organizes book
            covering sessions as necessary, coordinates the cake sale.
          </p>
          <div className="volunteersCheckbox">
            <input
              type="checkbox"
              onChange={onChangeEvent =>
                checked[familyId].includes('i9')
                  ? // if already in array
                    uncheckCheckbox(familyId, 'i9', onChangeEvent)
                  : // if not yet in array
                    checkCheckbox(familyId, 'i9', onChangeEvent)
              }
              id="i9"
              className="filled-in checkbox-orange z-depth-2"
              // checked={}
              // disabled='disabled'
            />
            <label htmlFor="i9">{itemsById.i9.name}</label>
          </div>
        </div>
        <div className="container itemDetails">
          <p>
            If you prefer, you can also support by the organization of single
            events only.
            <br />Please select a few:
          </p>

          {volunteeringItems.slice(1).map(itemId => (
            <div key={itemId} className="volunteersCheckbox">
              <input
                type="checkbox"
                onChange={onChangeEvent =>
                  checked[familyId].includes(itemId)
                    ? // if already in array
                      uncheckCheckbox(familyId, itemId, onChangeEvent)
                    : // if not yet in array
                      checkCheckbox(familyId, itemId, onChangeEvent)
                }
                id={itemId}
                className="filled-in checkbox-orange z-depth-2"
                // checked={}
              />
              <label htmlFor={itemId}>{itemsById[itemId].name}</label>
            </div>
          ))}

          {/* Thank you! We'll call you back! */}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    volunteeringItems: getVolunteeringItems(state),
    itemsById: getItemsById(state),
    familyId: getFamilyId(state),
    checked: getChecked(state)
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

export default connect(mapStateToProps, mapDispatchToProps)(CallForVolunteers);

// CallForVolunteers.propTypes = {
// formIsValid: PropTypes.objectOf(PropTypes.bool).isRequired
// };

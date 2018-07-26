import React, { Component } from 'react';
import { connect } from 'react-redux';
import { uncheckCheckbox, checkCheckbox } from '../actions/index';
import { bindActionCreators } from 'redux';
import {
  // gete1Items,
  getChecked,
  getFamilyId,
  getItemsById
} from '../selectors';
// import PropTypes from 'prop-types';

class CallForVolunteers extends Component {
  render() {
    const {
      familyId,
      checked,
      checkCheckbox,
      uncheckCheckbox,
      itemsById
    } = this.props;
    const e1Items = [
      'i9',
      'i10',
      'i11',
      'i12',
      'i13',
      'i14',
      'i15',
      'i16',
      'i17',
      'i18',
      'i19'
    ];

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
                checked[familyId].includes('i20')
                  ? // if already in array
                    uncheckCheckbox(familyId, 'i20', onChangeEvent)
                  : // if not yet in array
                    checkCheckbox(familyId, 'i20', onChangeEvent)
              }
              id="i20"
              className="filled-in checkbox-orange z-depth-2"
              // checked={}
              // disabled='disabled'
            />
            <label htmlFor="i20">{itemsById.i20.name}</label>
          </div>
        </div>
        <div className="container itemDetails">
          <p>
            If you prefer, you can also support by the organization of single
            short-time events.
            <br />Please select a few:
          </p>

          {e1Items.map(itemId => (
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
    // e1Items: gete1Items(state),
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

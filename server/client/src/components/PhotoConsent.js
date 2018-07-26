import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { uncheckCheckbox, checkCheckbox } from '../actions/index';
import PropTypes from 'prop-types';
import {
  getFirstValidParentName,
  getEventProviderName,
  getFamilyId,
  getChecked,
  getValidKids,
  getFamilyById
} from '../selectors';

class PhotoConsent extends Component {
  render() {
    const {
      firstValidParentName,
      validKids,
      familyId,
      eventProviderName,
      checkCheckbox,
      uncheckCheckbox,
      checked,
      familyById
    } = this.props;

    const childrenFullNames = validKids // [k0', 'k1' ]
      .map((userId, index) => (
        <p key={index}>
          {familyById[userId].firstName} {familyById[userId].familyName}
        </p>
      ));

    const consentText = (
      <span>
        Check this box to <strong> give {eventProviderName} permission </strong>{' '}
        to take photographs and videos of your children: {childrenFullNames} and
        grant {eventProviderName}
        <strong> full rights</strong> to use the images resulting from the
        photography and video filming, and any reproductions or adaptations of
        the images for fundraising, publicity or other purposes to help achieve
        the association's aims. This might include (but is not limited to) the
        right to use them in their printed and online newsletters, websites,
        publicities, social media, press releases and funding applications.
        <p className="signature">
          <strong>Signature: {firstValidParentName}</strong>
        </p>
      </span>
    );

    return (
      <div className="itemsContainer hoverable">
        <h4 className="stepTitle">③ Photo & video consent</h4>
        <div className="container itemDetails">
          <div className="photoConsentCheckbox">
            <input
              type="checkbox"
              onChange={onChangeEvent =>
                checked[familyId].includes('i21')
                  ? // if already in array
                    uncheckCheckbox(familyId, 'i21', onChangeEvent)
                  : // if not yet in array
                    checkCheckbox(familyId, 'i21', onChangeEvent)
              }
              id="i21"
              className="filled-in checkbox-orange z-depth-2"
            />
            {/* <label htmlFor="i21">{consentText}</label> */}
            <label htmlFor="i21" />
            <div>{consentText}</div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    eventProviderName: getEventProviderName(state),
    familyId: getFamilyId(state),
    checked: getChecked(state),
    validKids: getValidKids(state),
    familyById: getFamilyById(state),
    firstValidParentName: getFirstValidParentName(state)
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

export default connect(mapStateToProps, mapDispatchToProps)(PhotoConsent);

PhotoConsent.propTypes = {
  checkCheckbox: PropTypes.func.isRequired,
  uncheckCheckbox: PropTypes.func.isRequired,
  eventProviderName: PropTypes.string.isRequired,
  familyId: PropTypes.string.isRequired,
  checked: PropTypes.object.isRequired,
  validKids: PropTypes.array.isRequired
};

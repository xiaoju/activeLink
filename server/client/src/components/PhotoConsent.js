import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { togglePhotoConsent } from '../actions/index';
import PropTypes from 'prop-types';
import {
  getPhotoConsent,
  getFirstValidParentName,
  getEventProviderName,
  getValidKids,
  getFamilyById
} from '../selectors';

class PhotoConsent extends Component {
  render() {
    const {
      sectionTitle,
      firstValidParentName,
      validKids,
      eventProviderName,
      togglePhotoConsent,
      familyById,
      photoConsent
    } = this.props;

    const childrenFullNames = validKids // [k0', 'k1' ]
      .map(
        (userId, index) =>
          familyById[userId].firstName + ' ' + familyById[userId].familyName
      )
      .join(' & ');

    const disapproveText = (
      <span>
        I <strong>don't give permission</strong> to <em>{eventProviderName}</em>{' '}
        to take photographs and videos of my children{' '}
        <strong>{childrenFullNames}</strong>.
      </span>
    );

    const approveText = (
      <span>
        {' '}
        I <strong>give permission</strong> to <em>{eventProviderName}</em> to
        take photographs and videos of my children{' '}
        <strong>{childrenFullNames}</strong>, and I grant{' '}
        <em>{eventProviderName}</em>
        <strong> the full rights</strong> to use the images resulting from the
        photography and video filming, and any reproductions or adaptations of
        the images for fundraising, publicity or other purposes to help achieve
        the association's aims. This might include (but is not limited to) the
        right to use them in their printed and online newsletters, websites,
        publicities, social media, press releases and funding applications.
      </span>
    );

    return (
      <div className="itemsContainer hoverable">
        <h4 className="stepTitle">{sectionTitle}</h4>
        <div className="container itemDetails">
          <div className="photoConsentCheckbox">
            <div className="switch">
              <label>
                <strong>Don't give permission</strong>
                <input
                  type="checkbox"
                  checked={photoConsent && 'checked'}
                  onChange={event => togglePhotoConsent()}
                />
                <span className="lever" />
                <strong>Give permission</strong>
              </label>
            </div>
            <br />
            <div>{photoConsent ? approveText : disapproveText}</div>
            <p className="signature">
              <strong>Signature: {firstValidParentName}</strong>
            </p>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    photoConsent: getPhotoConsent(state),
    eventProviderName: getEventProviderName(state),
    validKids: getValidKids(state),
    familyById: getFamilyById(state),
    firstValidParentName: getFirstValidParentName(state)
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      togglePhotoConsent: togglePhotoConsent
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(PhotoConsent);

PhotoConsent.propTypes = {
  togglePhotoConsent: PropTypes.func.isRequired,
  photoConsent: PropTypes.bool.isRequired,
  eventProviderName: PropTypes.string.isRequired,
  validKids: PropTypes.array.isRequired
};

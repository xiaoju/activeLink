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
  componentDidMount() {
    this.props.checkCheckbox(this.props.familyId, 'i22');
    // BUG I have multiple rerenders, and the initial state get lost
  }

  // componentDidUpdate() {
  //   // BUG this causes some infinite loop. just wanting i21 to have initial state: checked.
  //   this.props.checkCheckbox(this.props.familyId, 'i21');
  // }

  render() {
    const {
      sectionTitle,
      firstValidParentName,
      validKids,
      familyId,
      eventProviderName,
      checkCheckbox,
      uncheckCheckbox,
      checked,
      familyById
    } = this.props;

    // const childrenFullNames = validKids // [k0', 'k1' ]
    //   .map((userId, index) => (
    //     <p key={index}>
    //       {familyById[userId].firstName} {familyById[userId].familyName}
    //     </p>
    //   ));

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
                  checked={checked[familyId].includes('i22') && 'checked'}
                  onChange={onChangeEvent =>
                    checked[familyId].includes('i22')
                      ? // if already in array
                        uncheckCheckbox(familyId, 'i22', onChangeEvent)
                      : // if not yet in array
                        checkCheckbox(familyId, 'i22', onChangeEvent)
                  }
                />
                <span className="lever" />
                <strong>Give permission</strong>
              </label>
            </div>
            <br />
            <div>
              {checked[familyId].includes('i22') ? approveText : disapproveText}
            </div>
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

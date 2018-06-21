import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getParents, getKids, getFamilyMedia } from '../selectors';
import OneKidForm from './OneKidForm';
import OneEmailForm from './OneEmailForm';

class ProfileForm extends Component {
  render() {
    const { parents, kids, familyMedia } = this.props;

    return (
      <div className="itemsContainer hoverable">
        <h4 className="stepTitle">① Update your profile</h4>
        <h5>
          <strong>Kids</strong>
        </h5>
        {kids.map(userId => <OneKidForm key={userId} userId={userId} />)}
        <h5>
          <strong>Parents</strong>
        </h5>
        {parents.map(userId => <OneKidForm key={userId} userId={userId} />)}
        {familyMedia.map((mediaObject, index) => (
          <OneEmailForm key={index} index={index} mediaObject={mediaObject} />
        ))}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    parents: getParents(state),
    kids: getKids(state),
    familyMedia: getFamilyMedia(state)
  };
}

export default connect(mapStateToProps)(ProfileForm);

ProfileForm.propTypes = {
  parents: PropTypes.array.isRequired,
  kids: PropTypes.array.isRequired,
  familyMedia: PropTypes.array.isRequired
};

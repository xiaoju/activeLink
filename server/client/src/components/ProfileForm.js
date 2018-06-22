import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getAllParents, getAllKids, getFamilyMedia } from '../selectors';
import OneKidForm from './OneKidForm';
import OneMediaForm from './OneMediaForm';

class ProfileForm extends Component {
  render() {
    const { allParents, allKids, familyMedia } = this.props;

    return (
      <div className="itemsContainer hoverable">
        <h4 className="stepTitle">① Update your profile</h4>
        <h5>
          <strong>Kids</strong>
        </h5>
        {allKids.map(userId => <OneKidForm key={userId} userId={userId} />)}
        <h5>
          <strong>Parents</strong>
        </h5>
        {allParents.map(userId => <OneKidForm key={userId} userId={userId} />)}
        <h5>
          <strong>Contacts</strong>
        </h5>
        {familyMedia.map((mediaObject, index) => (
          <OneMediaForm key={mediaObject.value} index={index} />
        ))}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    allParents: getAllParents(state),
    allKids: getAllKids(state),
    familyMedia: getFamilyMedia(state)
  };
}

export default connect(mapStateToProps)(ProfileForm);

ProfileForm.propTypes = {
  allParents: PropTypes.array.isRequired,
  allKids: PropTypes.array.isRequired,
  familyMedia: PropTypes.array.isRequired
};

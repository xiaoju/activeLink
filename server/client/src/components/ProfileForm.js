import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  getAllParents,
  getAllKids,
  getAddresses,
  getFamilyMedia
} from '../selectors';
import OneKidForm from './OneKidForm';
import OneAddressForm from './OneAddressForm';
import OneMediaForm from './OneMediaForm';

class ProfileForm extends Component {
  render() {
    const { allParents, allKids, addresses, familyMedia } = this.props;

    return (
      <div className="itemsContainer hoverable">
        <div className="innerContainer">
          <h4 className="stepTitle">① Update your profile</h4>
          <div className="title_and_button">
            <h5>
              <strong>Kids</strong>
            </h5>
          </div>
          {allKids.map(userId => <OneKidForm key={userId} userId={userId} />)}
          <div className="title_and_button">
            <h5>
              <strong>Parents</strong>
            </h5>
          </div>
          {allParents.map(userId => (
            <OneKidForm key={userId} userId={userId} />
          ))}
          <div className="title_and_button">
            <h5>
              <i className="material-icons small">home</i>
            </h5>
          </div>
          {addresses.map((addressObject, index) => (
            <OneAddressForm
              key={index}
              index={index}
              addressObject={addressObject}
            />
          ))}
          <div className="title_and_button">
            <h5>
              <i className="material-icons small">phone</i> &nbsp; &nbsp;
              <i className="material-icons small">email</i>
            </h5>
          </div>
          {familyMedia.map((mediaObject, index) => (
            <OneMediaForm key={index} index={index} />
          ))}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    allParents: getAllParents(state),
    allKids: getAllKids(state),
    addresses: getAddresses(state),
    familyMedia: getFamilyMedia(state)
  };
}

export default connect(mapStateToProps)(ProfileForm);

ProfileForm.propTypes = {
  allParents: PropTypes.array.isRequired,
  allKids: PropTypes.array.isRequired,
  addresses: PropTypes.array.isRequired,
  familyMedia: PropTypes.array.isRequired
};

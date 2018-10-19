import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  getAddressTagOptions,
  getMediaTagOptions,
  getPrimaryEmail,
  getAllParents,
  getAllKids,
  getAddresses,
  getFamilyMedia
} from '../selectors';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PageSection from './layout/PageSection';
import OneKidForm from './OneKidForm';
import OneAddressForm from './OneAddressForm';
import OneMediaForm from './OneMediaForm';

class ProfileForm extends Component {
  render() {
    const {
      mediaTagOptions,
      addressTagOptions,
      primaryEmail,
      sectionTitle,
      allParents,
      allKids,
      addresses,
      familyMedia
    } = this.props;

    return (
      <PageSection sectionTitle={sectionTitle}>
        <div className="innerContainer">
          <div className="title_and_button">
            <h5>
              <strong>Children</strong>
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
              <FontAwesomeIcon icon="home" />
            </h5>
          </div>
          {addresses.map((addressObject, index) => (
            <OneAddressForm
              key={index}
              index={index}
              value={addresses[index].value}
              tags={addresses[index].tags}
              tagOptions={addressTagOptions}
              caption="Postal address"
              valueExample="1 place du Capitole, 31000 Toulouse FRANCE"
            />
          ))}
          <div className="title_and_button">
            <h5>
              <FontAwesomeIcon icon="phone" />
              &nbsp; &nbsp;
              <FontAwesomeIcon icon="envelope" />
            </h5>
          </div>
          <OneMediaForm // readyOnly view of the primaryEmail
            key="primaryEmail"
            isDisabled={true}
            // index={0}  // not required because readOnly
            media="email"
            value={primaryEmail}
            tags={['primary']}
            tagOptions={[]}
            caption="Primary email address, used to log in"
            valueExample="(This field is &quot;read only&quot;)"
          />
          {[...familyMedia.keys()] // [0, 1, 2, 3]
            .map(index => (
              <OneMediaForm
                key={index}
                index={index}
                media={familyMedia[index].media}
                value={familyMedia[index].value}
                tags={familyMedia[index].tags}
                tagOptions={mediaTagOptions}
                caption="Other email or phone number"
                valueExample="my.name@example.com or 0612345678"
              />
            ))}
        </div>
      </PageSection>
    );
  }
}

function mapStateToProps(state) {
  return {
    addressTagOptions: getAddressTagOptions(state),
    mediaTagOptions: getMediaTagOptions(state),
    primaryEmail: getPrimaryEmail(state),
    allParents: getAllParents(state),
    allKids: getAllKids(state),
    addresses: getAddresses(state),
    familyMedia: getFamilyMedia(state)
  };
}

export default connect(mapStateToProps)(ProfileForm);

ProfileForm.propTypes = {
  mediaTagOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    }).isRequired
  ).isRequired,
  addressTagOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    }).isRequired
  ).isRequired,
  primaryEmail: PropTypes.string.isRequired,
  sectionTitle: PropTypes.string.isRequired,
  sectionInstructions: PropTypes.string,
  allParents: PropTypes.array.isRequired,
  allKids: PropTypes.array.isRequired,
  addresses: PropTypes.array.isRequired,
  familyMedia: PropTypes.array.isRequired
};

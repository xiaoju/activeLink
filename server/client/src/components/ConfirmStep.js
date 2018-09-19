import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  getPaymentOption,
  getInstallmentsQuantity,
  getEventProviderName,
  getFormIsValid,
  getTotal,
  getPhotoConsent,
  getFamilyId,
  getEventId,
  getValidKids,
  getValidParents,
  getValidAddresses,
  getValidMedia,
  getValidFamilyById,
  getValidChecked,
  getPrimaryEmail,
  getEventName
} from '../selectors';
import Payment from './Payment';
import ValidationPanel from './ValidationPanel';
import HelpContact from './HelpContact';

class ConfirmStep extends Component {
  render() {
    const {
      paymentOption,
      installmentsQuantity,
      sectionTitle,
      eventProviderName,
      total,
      formIsValid,
      eventName,
      primaryEmail,
      familyId,
      eventId,
      validKids,
      validParents,
      validAddresses,
      validMedia,
      validFamilyById,
      validChecked,
      photoConsent
    } = this.props;

    return (
      <div className="itemsContainer hoverable">
        <h4 className="stepTitle">{sectionTitle}</h4>
        <ValidationPanel />

        <div className="paymentOptions container">
          <Payment
            paymentOption={paymentOption}
            installmentsQuantity={installmentsQuantity}
            eventProviderName={eventProviderName}
            eventName={eventName}
            total={total}
            primaryEmail={primaryEmail}
            familyId={familyId}
            eventId={eventId}
            validKids={validKids}
            validParents={validParents}
            validAddresses={validAddresses}
            validMedia={validMedia}
            validFamilyById={validFamilyById}
            validChecked={validChecked}
            photoConsent={photoConsent}
            formIsValid={formIsValid}
          />
        </div>

        <HelpContact />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    paymentOption: getPaymentOption(state),
    installmentsQuantity: getInstallmentsQuantity(state),
    photoConsent: getPhotoConsent(state),
    familyId: getFamilyId(state),
    eventId: getEventId(state),
    validKids: getValidKids(state),
    validParents: getValidParents(state),
    validAddresses: getValidAddresses(state),
    validMedia: getValidMedia(state),
    validFamilyById: getValidFamilyById(state),
    validChecked: getValidChecked(state),
    primaryEmail: getPrimaryEmail(state),
    eventName: getEventName(state),
    total: getTotal(state),
    formIsValid: getFormIsValid(state),
    eventProviderName: getEventProviderName(state)
  };
}

export default connect(mapStateToProps)(ConfirmStep);

ConfirmStep.propTypes = {
  paymentOption: PropTypes.string,
  installmentsQuantity: PropTypes.number.isRequired,
  photoConsent: PropTypes.bool.isRequired,
  familyId: PropTypes.string.isRequired,
  eventId: PropTypes.string.isRequired,
  validKids: PropTypes.array.isRequired,
  validParents: PropTypes.array.isRequired,
  validMedia: PropTypes.array.isRequired,
  validFamilyById: PropTypes.object.isRequired,
  validChecked: PropTypes.object.isRequired,
  total: PropTypes.number.isRequired,
  primaryEmail: PropTypes.string.isRequired,
  eventName: PropTypes.string.isRequired,
  formIsValid: PropTypes.objectOf(PropTypes.bool).isRequired,
  eventProviderName: PropTypes.string.isRequired
};

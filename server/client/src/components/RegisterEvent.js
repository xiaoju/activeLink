import React, { Component } from 'react';
import { connect } from 'react-redux';
import SpinnerWrapper from './SpinnerWrapper';
import ProfileForm from './ProfileForm';
import SelectClassesForm from './SelectClassesForm';
import OrderSummary from './OrderSummary';
import PhotoConsent from './PhotoConsent';
import CallForVolunteers from './CallForVolunteers';
import ConfirmStep from './ConfirmStep';

class RegisterEvent extends Component {
  render() {
    return (
      <div>
        {this.props.profile && !this.props.event && <SpinnerWrapper />}

        {this.props.profile &&
          this.props.event && (
            <div>
              <ProfileForm />
              <SelectClassesForm />
              <PhotoConsent />
              <CallForVolunteers />
              <OrderSummary />
              <ConfirmStep />
            </div>
          )}
      </div>
    );
  }
}

function mapStateToProps({ profile, event }) {
  return {
    profile,
    event
  };
}

export default connect(mapStateToProps)(RegisterEvent);

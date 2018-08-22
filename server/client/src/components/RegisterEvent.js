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
        {!this.props.profile && <h5>Please log in!</h5>}
        {/* TODO: add a redirect to login page instead of this 'please log in' message */}

        {this.props.profile && !this.props.event && <SpinnerWrapper />}

        {this.props.profile &&
          this.props.event && (
            <div>
              <ProfileForm sectionTitle="① Update your profile" />
              <SelectClassesForm sectionTitle="② Select classes for your kids" />
              <CallForVolunteers sectionTitle="③ Call for Volunteers!" />
              <PhotoConsent sectionTitle="④ Photo & video consent" />
              <OrderSummary sectionTitle="⑤ Review your order" />
              <ConfirmStep sectionTitle="⑥ Confirm and pay" />
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

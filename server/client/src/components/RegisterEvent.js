import React, { Component } from 'react';
import { connect } from 'react-redux';
import SpinnerWrapper from './SpinnerWrapper';
import ProfileForm from './ProfileForm';
import SelectClassesForm from './SelectClassesForm';
import OrderSummary from './OrderSummary';
import PhotoConsent from './PhotoConsent';
import CallForVolunteers from './CallForVolunteers';
import ConfirmStep from './ConfirmStep';

// line 22, should have several events in redux state at same time.
// TODO show the form for the one event that has currently focus
// somewhere need a view to choose which event to register, if several available,
// or redirect directly to register if only 1 is available for booking now.

class RegisterEvent extends Component {
  render() {
    return (
      <div>
        {!this.props.profile && <h5>Please log in!</h5>}

        {this.props.profile && !this.props.events && <SpinnerWrapper />}

        {this.props.profile &&
          this.props.events && (
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

function mapStateToProps({ profile, events }) {
  return {
    profile,
    events
  };
}

export default connect(mapStateToProps)(RegisterEvent);

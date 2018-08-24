import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { push } from 'connected-react-router';
import SpinnerWrapper from './SpinnerWrapper';
import ProfileForm from './ProfileForm';
import SelectClassesForm from './SelectClassesForm';
import OrderSummary from './OrderSummary';
import PhotoConsent from './PhotoConsent';
import CallForVolunteers from './CallForVolunteers';
import ConfirmStep from './ConfirmStep';

class RegisterEvent extends Component {
  // componentDidMount() {
  //   if (!this.props.profile) {
  //     console.log('RegisterEvent did mount, redirecting to /login');
  //     this.props.dispatch(push('/login'));
  //     // this doesn't work, even logged in you are redirected to /login
  //   }
  // }
  //
  // componentDidUpdate() {
  //   if (!this.props.profile) {
  //     console.log('RegisterEvent did update, redirecting to /login');
  //     this.props.dispatch(push('/login'));
  //     // this doesn't work, even logged in you are redirected to /login
  //   }
  // }

  render() {
    return (
      <div>
        {!this.props.profile && (
          // this.props.dispatch(push('/login'))
          <h5>Please log in!</h5>
        )}

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

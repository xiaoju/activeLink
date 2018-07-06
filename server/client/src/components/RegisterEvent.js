import React, { Component } from 'react';
import { connect } from 'react-redux';
import SpinnerWrapper from './SpinnerWrapper';
import ProfileForm from './ProfileForm';
import SelectClassesForm from './SelectClassesForm';
import ConfirmStep from './ConfirmStep';
import OrderSummary from './OrderSummary';

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

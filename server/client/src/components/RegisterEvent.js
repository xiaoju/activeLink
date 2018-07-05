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
      <div style={{ textAlign: 'center' }}>
        {/* <p>Credits: {this.props.auth && this.props.auth.credits}</p> */}
        {/* ①②③④⑤⑥⑦⑧⑨⑩ */}
        {/* {!this.props.profile && (
          <h5>
            <strong>Please log in to show the members area.</strong>
          </h5>
        )} */}
        {this.props.profile && !this.props.event && <SpinnerWrapper />
        // cannot user `this.props.data` because dataReducer creates an empty
        // `this.props.data` object by initialization. Using instead
        // `this.props.data.eventId` to detect if data arrived from api
        }

        {/* TODO test if user has paid 'i0'. If no, show registration below stuff. If yes, show other stuff.  */}

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

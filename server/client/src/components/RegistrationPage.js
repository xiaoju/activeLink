import React, { Component } from 'react';
import { connect } from 'react-redux';
import EventDescription from './EventDescription';
import ProfileForm from './ProfileForm';
import SelectClassesForm from './SelectClassesForm';
import ConfirmStep from './ConfirmStep';
import OrderSummary from './OrderSummary';

class RegistrationPage extends Component {
  render() {
    return (
      <div style={{ textAlign: 'center' }}>
        {/* <p>Credits: {this.props.auth && this.props.auth.credits}</p> */}
        {/* ①②③④⑤⑥⑦⑧⑨⑩ */}
        {!this.props.auth && (
          <h5>
            <strong>Please log in to show the members area.</strong>
          </h5>
        )}

        {this.props.auth &&
          this.props.data && (
            <div>
              <EventDescription eventName={this.props.data.eventName} />
              <ProfileForm />
              <SelectClassesForm />
              <OrderSummary />
              <ConfirmStep
                eventContactName={this.props.data.eventContactName}
                eventContactPhone={this.props.data.eventContactPhone}
                eventContactEmail={this.props.data.eventContactEmail}
              />
            </div>
          )}
      </div>
    );
  }
}

function mapStateToProps({ auth, data }) {
  return {
    auth,
    data
  };
}

export default connect(mapStateToProps)(RegistrationPage);

import React, { Component } from 'react';
import { connect } from 'react-redux';
import EventDescription from './EventDescription';
import ProfileForm from './ProfileForm';
import SelectClassesForm from './SelectClassesForm';
import ConfirmStep from './ConfirmStep';
import OrderSummary from './OrderSummary';

class Events02 extends Component {
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
              <EventDescription eventName={this.props.data.event.name} />
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

function mapStateToProps({ auth, data }) {
  return {
    auth,
    data
  };
}

export default connect(mapStateToProps)(Events02);

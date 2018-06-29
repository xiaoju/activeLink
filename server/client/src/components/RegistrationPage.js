import React, { Component } from 'react';
import { connect } from 'react-redux';
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

        {this.props.auth && !this.props.data.eventId && <h5>Loading...</h5>
        // cannot user `this.props.data` because dataReducer creates an empty
        // `this.props.data` object by initialization. Using instead
        // `this.props.data.eventId` to detect if data arrived from api
        }

        {this.props.auth &&
          this.props.data.eventId && (
            //
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

function mapStateToProps({ auth, data }) {
  return {
    auth,
    data
  };
}

export default connect(mapStateToProps)(RegistrationPage);

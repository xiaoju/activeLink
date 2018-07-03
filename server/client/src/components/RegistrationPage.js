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
        {!this.props.profile && (
          <h5>
            <strong>Please log in to show the members area.</strong>
          </h5>
        )}
        {this.props.profile &&
          !this.props.data.eventId && (
            <div>
              <br />
              <h5 className="stepTitle">Loading...</h5>
              <br />
              <div className="preloader-wrapper active">
                <div className="spinner-layer spinner-red-only">
                  <div className="circle-clipper left">
                    <div className="circle" />
                  </div>
                  <div className="gap-patch">
                    <div className="circle" />
                  </div>
                  <div className="circle-clipper right">
                    <div className="circle" />
                  </div>
                </div>
              </div>
            </div>
          )
        // cannot user `this.props.data` because dataReducer creates an empty
        // `this.props.data` object by initialization. Using instead
        // `this.props.data.eventId` to detect if data arrived from api
        }

        {this.props.profile &&
          this.props.data.eventId && (
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

function mapStateToProps({ profile, data }) {
  return {
    profile,
    data
  };
}

export default connect(mapStateToProps)(RegistrationPage);

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Payments from './Payments';

class ConfirmStep extends Component {
  render() {
    return (
      <div className="itemsContainer hoverable">
        <h4 className="stepTitle">④ Confirm and pay</h4>
        <Payments />
        <div className="container">
          <p>
            Payments are securely processed by 'Stripe'. The connection to the
            servers is encrypted. English Link doesn't see credit card numbers
            neither passwords.
          </p>
          <p>
            <span>Any questions? Please contact us!</span>
            {this.props.data.eventContacts.map(contactId => (
              <div key={contactId} className="eventContacts">
                <span>{this.props.data.staff[contactId].name}</span>
                <span>{this.props.data.staff[contactId].phone}</span>
                <span>{this.props.data.staff[contactId].email}</span>
              </div>
            ))}
          </p>
        </div>
      </div>
    );
  }
}

function mapStateToProps({ data }) {
  return {
    data
  };
}

export default connect(mapStateToProps)(ConfirmStep);

ConfirmStep.propTypes = {
  contacts: PropTypes.array
};

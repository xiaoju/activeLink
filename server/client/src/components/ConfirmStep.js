import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getStaff, getEventContacts } from '../selectors';
import Payments from './Payments';

class ConfirmStep extends Component {
  render() {
    const { staff, eventContacts } = this.props;

    return (
      <div className="itemsContainer hoverable">
        <h4 className="stepTitle">④ Confirm and pay</h4>
        <div className="container">
          <Payments />
          <div className="categoryIcon">
            <div className="myIconContainer">
              <i className="small material-icons prefix">help_outline</i>
            </div>
            <div className="myContactsContainer">
              <span>Payments are securely processed by 'Stripe'.</span>
              <span>The connection to the servers is encrypted.</span>
              <span>
                English Link doesn't see credit card numbers neither passwords.
              </span>
              <br />
              <span>Any questions? Please contact us!</span>
              {eventContacts.map(contactId => (
                <div key={contactId} className="eventContacts">
                  <span>{staff[contactId].name}</span>
                  <span>{staff[contactId].phone}</span>
                  <span>{staff[contactId].email}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    staff: getStaff(state),
    eventContacts: getEventContacts(state)
  };
}

export default connect(mapStateToProps)(ConfirmStep);

ConfirmStep.propTypes = {
  staff: PropTypes.object,
  eventContacts: PropTypes.array
};

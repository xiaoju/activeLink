import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  getStaffPerId,
  getEventProviderName,
  getEventContacts
} from '../selectors';
import Payments from './Payments';

class ConfirmStep extends Component {
  render() {
    const { staffPerId, eventProviderName, eventContacts } = this.props;

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
              <span>
                Payments are securely processed by 'stripe.com' following
                '3D-Secure' authentication.
              </span>
              <span>The connections to the servers are encrypted.</span>
              <span>
                {eventProviderName} doesn't see credit card numbers neither
                passwords.
              </span>
              <br />
              <span>Any questions? Please contact us!</span>
              {eventContacts.map(contactId => (
                <div key={contactId} className="eventContacts">
                  <span>
                    {staffPerId[contactId].firstName}{' '}
                    {staffPerId[contactId].familyName}
                  </span>
                  <span>{staffPerId[contactId].phone}</span>
                  <span>{staffPerId[contactId].email}</span>
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
    staffPerId: getStaffPerId(state),
    eventProviderName: getEventProviderName(state),
    eventContacts: getEventContacts(state)
  };
}

export default connect(mapStateToProps)(ConfirmStep);

ConfirmStep.propTypes = {
  staffPerId: PropTypes.object.isRequired,
  eventProviderName: PropTypes.string.isRequired,
  eventContacts: PropTypes.array.isRequired
};

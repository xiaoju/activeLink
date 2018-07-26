import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  getStaffById,
  getEventProviderName,
  getEventContacts
} from '../selectors';
import Payments from './Payments';
import { capitalizeFirstLetter } from '../utils/Tools';

class ConfirmStep extends Component {
  render() {
    const { staffById, eventProviderName, eventContacts } = this.props;

    return (
      <div className="itemsContainer hoverable">
        <h4 className="stepTitle">⑥ Confirm and pay</h4>
        <div className="container">
          <Payments />
          <div className="categoryIcon">
            <div className="myIconContainer">
              <i className="small material-icons prefix">help_outline</i>
            </div>
            <div className="myContactsContainer">
              <span>
                Payments are securely processed by 'stripe.com'
                {/* following '3D-Secure' authentication. */}
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
                    {staffById[contactId].firstName}{' '}
                    {staffById[contactId].familyName}
                  </span>
                  <span>{capitalizeFirstLetter(staffById[contactId].job)}</span>
                  <span>{staffById[contactId].phone}</span>
                  <span>{staffById[contactId].email}</span>
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
    staffById: getStaffById(state),
    eventProviderName: getEventProviderName(state),
    eventContacts: getEventContacts(state)
  };
}

export default connect(mapStateToProps)(ConfirmStep);

ConfirmStep.propTypes = {
  staffById: PropTypes.object.isRequired,
  eventProviderName: PropTypes.string.isRequired,
  eventContacts: PropTypes.array.isRequired
};

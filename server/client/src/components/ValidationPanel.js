import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getFormIsValid, getPaymentOption } from '../selectors';
import PropTypes from 'prop-types';

class ValidationPanel extends Component {
  render() {
    const {
      paymentOption,
      formIsValid: {
        totalNotZero,
        oneAddressMini,
        // oneEmailMini,
        oneKidMini,
        oneParentMini,
        onePhoneMini
      }
    } = this.props;

    return (
      <div className="card-panel validationMessage container">
        {!totalNotZero && (
          <p>
            <strong>Items:</strong> please select the items you want to purchase
            by clicking on the orange checkboxes.
          </p>
        )}
        {/* {!oneEmailMini && (
          <p>
            <strong>Emails:</strong> please enter at least one valid email.
          </p>
        )} */}
        {!oneAddressMini && (
          <p>
            <strong>Postal address:</strong> please enter at least one address.
          </p>
        )}
        {!onePhoneMini && (
          <p>
            <strong>Phone numbers:</strong> please enter at least one phone
            number. Digits only: no '+', no '( )', no 'space'.
          </p>
        )}
        {!oneKidMini && (
          <p>
            <strong>Kids:</strong> For each kid, please fill-in the THREE
            FIELDS: first name, family name and <strong>school grade</strong>.
          </p>
        )}
        {!oneParentMini && (
          <p>
            <strong>Parents:</strong> please enter first name and family name
            for at least 1 parent.
          </p>
        )}
        {!paymentOption && (
          <p>
            <strong>Payment option:</strong> please select a payment option in
            section ⑥.
          </p>
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    paymentOption: getPaymentOption(state),
    formIsValid: getFormIsValid(state)
  };
}

export default connect(mapStateToProps)(ValidationPanel);

ValidationPanel.propTypes = {
  paymentOption: PropTypes.string,
  formIsValid: PropTypes.objectOf(PropTypes.bool).isRequired
};

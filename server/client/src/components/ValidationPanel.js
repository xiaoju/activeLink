import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getFormIsValid } from '../selectors';
import PropTypes from 'prop-types';

class ValidationPanel extends Component {
  render() {
    const {
      formIsValid: {
        totalNotZero,
        oneAddressMini,
        oneEmailMini,
        oneKidMini,
        oneParentMini,
        onePhoneMini
      }
    } = this.props;

    return (
      <div
        className="card-panel orange lighten-1 validationMessage"
        style={{
          borderRadius: '15px',
          margin: '1em auto'
        }}
      >
        {!totalNotZero && (
          <p>
            <strong>Items:</strong> please select the items you want to purchase
            by clicking on the orange checkboxes.
          </p>
        )}
        {!oneEmailMini && (
          <p>
            <strong>Emails:</strong> please enter at least one valid email.
          </p>
        )}
        {!oneAddressMini && (
          <p>
            <strong>Postal address:</strong> please enter at least one address.
          </p>
        )}
        {!onePhoneMini && (
          <p>
            <strong>Phone numbers:</strong> please enter at least one phone
            number.
          </p>
        )}
        {!oneKidMini && (
          <p>
            <strong>Kids:</strong> please enter first name, family name and
            school grade for at least 1 kid.
          </p>
        )}
        {!oneParentMini && (
          <p>
            <strong>Parents:</strong> please enter first name and family name
            for at least 1 parent.
          </p>
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    formIsValid: getFormIsValid(state)
  };
}

export default connect(mapStateToProps)(ValidationPanel);

ValidationPanel.propTypes = {
  formIsValid: PropTypes.objectOf(PropTypes.bool).isRequired
};

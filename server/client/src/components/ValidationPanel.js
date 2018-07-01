import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getFormIsValid } from '../selectors';
import PropTypes from 'prop-types';

class ValidationPanel extends Component {
  render() {
    const {
      formIsValid: {
        totalNotZero,
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
            Please select the items you want to purchase by clicking on the
            orange checkboxes (see "step 2" section).
          </p>
        )}
        {!oneEmailMini && (
          <p>Please enter at least one valid Email in section 1.</p>
        )}
        {!onePhoneMini && (
          <p>Please enter at least one valid phone number (section 1).</p>
        )}
        {!oneKidMini && (
          <p>
            Please enter in section 1 the data for at least 1 kid: first name,
            family name and school grade.
          </p>
        )}
        {!oneParentMini && (
          <p>
            In section 1, please enter first name and family name for at least 1
            parent.
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

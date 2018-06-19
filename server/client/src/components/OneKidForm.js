import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getFirstName, getUserFamilyName, getKidGrade } from '../selectors';

class OneKidForm extends Component {
  render() {
    const { firstName, userFamilyName, kidGrade } = this.props;

    return (
      <form className="formInputsContainer">
        <div className="twoNamesContainer">
          <div className="input-field firstName">
            <i className="material-icons prefix">face</i>
            <input
              id="icon_prefix"
              type="text"
              className="validate"
              value={firstName}
            />
            <label htmlFor="icon_prefix" className="active">
              First Name
            </label>
          </div>

          <div className="input-field familyName">
            <input
              id="icon_prefix"
              type="text"
              className="validate"
              value={userFamilyName}
            />
            <label htmlFor="icon_prefix" className="active">
              Family Name
            </label>
          </div>
        </div>
        {/* <form onSubmit={this.handleSubmit}> */}
        <div className="schoolGrade">
          <label>Grade</label>
          <select
            className="browser-default"
            value={kidGrade}
            // onChange={this.handleChange}
          >
            <option value="PS">PS</option>
            <option value="MS">MS</option>
            <option value="GS">GS</option>
            <option disabled>──</option>
            <option value="CP">CP</option>
            <option value="CE1">CE1</option>
            <option value="CE2">CE2</option>
            <option value="CM1">CM1</option>
            <option value="CM2">CM2</option>
            <option disabled>──</option>
            <option value="older">older</option>
          </select>
        </div>
      </form>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    firstName: getFirstName(state, props),
    userFamilyName: getUserFamilyName(state, props),
    kidGrade: getKidGrade(state, props)
  };
}

export default connect(mapStateToProps)(OneKidForm);

OneKidForm.propTypes = {
  userId: PropTypes.string.isRequired,
  firstName: PropTypes.string.isRequired,
  userFamilyName: PropTypes.string.isRequired,
  kidGrade: PropTypes.string.isRequired
};

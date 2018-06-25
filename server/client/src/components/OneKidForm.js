import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import {
  getInvalidUsers,
  getFirstName,
  getUserFamilyName,
  getKidGrade
} from '../selectors';
import { modifyUser } from '../actions/index';

class OneKidForm extends Component {
  constructor(props) {
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    this.props.modifyUser({
      userId: this.props.userId,
      fieldName: event.target.name,
      value: event.target.value
    });
  }

  render() {
    const {
      userId,
      firstName,
      userFamilyName,
      kidGrade,
      invalidUsers
    } = this.props;

    return (
      <form className="formInputsContainer">
        <div className="twoNamesContainer">
          <div className="input-field firstName">
            {/* <i className="material-icons prefix icon-orange"> */}
            <i
              // className={
              //   'material-icons prefix ' +
              //   (!firstName ||
              //   !userFamilyName ||
              //   (!!kidGrade && kidGrade === ' ') //  This is a kid (kidGrade exists) and grade isn't set.
              //     ? 'icon-orange'
              //     : '')
              // }

              className={
                'material-icons prefix ' +
                (invalidUsers[userId] ? 'icon-orange' : '')
              }
            >
              {!!kidGrade ? 'face' : 'account_circle'}
            </i>
            <input
              name="firstName"
              id="icon_prefix"
              type="text"
              className="validate"
              value={firstName}
              onChange={this.handleInputChange}
            />
            <label htmlFor="icon_prefix" className="active">
              First Name
            </label>
          </div>

          <div className="input-field familyName">
            <input
              name="familyName"
              id="icon_prefix"
              type="text"
              className="validate"
              value={userFamilyName}
              onChange={this.handleInputChange}
            />
            <label htmlFor="icon_prefix" className="active">
              Family Name
            </label>
          </div>
        </div>

        {!!kidGrade && (
          <div className="schoolGrade">
            <label>Grade</label>
            <select
              name="kidGrade"
              className="browser-default"
              value={kidGrade}
              onChange={this.handleInputChange}
            >
              <option value=" "> </option>
              <option value="PS">PS</option>
              <option value="MS">MS</option>
              <option value="GS">GS</option>
              <option disabled>──</option>
              <option value="CP">CP</option>
              <option value="CE1">CE1</option>
              <option value="CE2">CE2</option>
              <option value="CM1">CM1</option>
              <option value="CM2">CM2</option>
            </select>
          </div>
        )}
      </form>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    invalidUsers: getInvalidUsers(state, props),
    firstName: getFirstName(state, props),
    userFamilyName: getUserFamilyName(state, props),
    kidGrade: getKidGrade(state, props)
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ modifyUser }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(OneKidForm);

OneKidForm.propTypes = {
  invalidUsers: PropTypes.object.isRequired,
  userId: PropTypes.string.isRequired,
  firstName: PropTypes.string.isRequired,
  userFamilyName: PropTypes.string.isRequired,
  kidGrade: PropTypes.string
};

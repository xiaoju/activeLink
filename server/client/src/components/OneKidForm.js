import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import {
  getAllKidsValid,
  getAllParentsValid,
  getValidUsers,
  getFirstName,
  getUserFamilyName,
  getKidGrade
} from '../selectors';
import { modifyUser, addKidRow, addParentRow } from '../actions/index';
// import { capitalizeFirstLetter } from '../utils/Tools';

class OneKidForm extends Component {
  constructor(props) {
    super(props);
    this.handleOnChangeEvent = this.handleOnChangeEvent.bind(this);
    this.handleOnBlurEvent = this.handleOnBlurEvent.bind(this);
  }

  handleOnBlurEvent(event) {
    // add an empty row, which will be used for inputing the next kid/parent,
    // as soon as the row being currently typed got valid.
    this.props.allKidsValid
      ? this.props.addKidRow()
      : this.props.allParentsValid && this.props.addParentRow();
  }

  handleOnChangeEvent(event) {
    // After each keystroke, save the new value to state. (This a "controlled form").
    this.props.modifyUser({
      userId: this.props.userId,
      fieldName: event.target.name,
      // value: capitalizeFirstLetter(event.target.value) // wrong with 'noms à particule'!
      value: event.target.value
    });
  }

  render() {
    const {
      userId,
      firstName,
      userFamilyName,
      kidGrade,
      validUsers
    } = this.props;

    return (
      <form className="formInputsContainer">
        <div className="twoNamesContainer">
          <div className="input-field firstName">
            <i
              className={
                'material-icons prefix ' +
                (validUsers.includes(userId) ? '' : 'icon-orange')
              }
            >
              {!!kidGrade ? 'face' : 'account_circle'}
            </i>
            <input
              name="firstName"
              id={userId + '-firstName'}
              className={!firstName ? 'pasValide' : ' '}
              value={firstName}
              onChange={this.handleOnChangeEvent}
              onBlur={this.handleOnBlurEvent}
            />
            <label htmlFor={userId + '-familyName'} className="active">
              First Name
            </label>
          </div>

          <div className="input-field familyName">
            <input
              name="familyName"
              id={userId + '-familyName'}
              className={!userFamilyName ? 'pasValide' : ''}
              value={userFamilyName}
              onChange={this.handleOnChangeEvent}
              onBlur={this.handleOnBlurEvent}
            />
            <label htmlFor={userId + '-familyName'} className="active">
              Family Name
            </label>
          </div>
        </div>

        {!!kidGrade && (
          <div className="schoolGrade">
            <label>Grade</label>
            <select
              name="kidGrade"
              className={
                kidGrade === ' '
                  ? 'browser-default pasValide'
                  : 'browser-default'
              }
              value={kidGrade}
              // onChange={this.handleOnChangeEvent}
              onChange={this.handleOnChangeEvent}
              onBlur={this.handleOnBlurEvent}
              // onInput={this.handleOnBlurEvent}
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
              <option disabled>──</option>
              <option value="6e">6e</option>
              <option value="5e">5e</option>
              <option value="4e">4e</option>
              <option value="3e">3e</option>
            </select>
          </div>
        )}
      </form>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    allKidsValid: getAllKidsValid(state),
    allParentsValid: getAllParentsValid(state),
    validUsers: getValidUsers(state),
    firstName: getFirstName(state, props),
    userFamilyName: getUserFamilyName(state, props),
    kidGrade: getKidGrade(state, props)
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ modifyUser, addKidRow, addParentRow }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(OneKidForm);

OneKidForm.propTypes = {
  addKidRow: PropTypes.func.isRequired,
  allKidsValid: PropTypes.bool.isRequired,
  allParentsValid: PropTypes.bool.isRequired,
  validUsers: PropTypes.array.isRequired,
  userId: PropTypes.string.isRequired,
  firstName: PropTypes.string.isRequired,
  userFamilyName: PropTypes.string.isRequired,
  kidGrade: PropTypes.string
};

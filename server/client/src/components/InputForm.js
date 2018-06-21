import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import {
  getFirstName,
  getUserFamilyName,
  getKidGrade,
  getMediaObject
} from '../selectors';
import { modifyUser, modifyMedia } from '../actions/index';

class InputForm extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleMediaChange = this.handleMediaChange.bind(this);
  }

  handleChange(event) {
    this.props.modifyUser({
      userId: this.props.userId,
      fieldName: event.target.name,
      value: event.target.value
    });
  }

  media = !!this.props.mediaObject &&
    (!!this.props.mediaObject.email ? 'email' : 'phone');

  handleMediaChange(event) {
    this.props.modifyMedia({
      index: this.props.index,
      media: this.media,
      value: event.target.value
    });
  }

  render() {
    const {
      firstName,
      userFamilyName,
      kidGrade,
      mediaObject,
      index
    } = this.props;

    return (
      <form className="formInputsContainer">
        <div className="twoNamesContainer">
          {!!firstName && (
            <div className="input-field firstName">
              <i className="material-icons prefix">
                {!!kidGrade ? 'face' : 'account_circle'}
              </i>
              <input
                name="firstName"
                id="icon_prefix"
                // type="text"
                className="validate"
                value={firstName}
                onChange={this.handleChange}
              />
              <label htmlFor="icon_prefix" className="active">
                First Name
              </label>
            </div>
          )}

          {!!index && (
            <div className="input-field firstName">
              <i className="material-icons prefix">{this.media}</i>
              <input
                id={this.media + index}
                name={this.media}
                className="validate"
                value={mediaObject[this.media]}
                onChange={this.handleChange}
              />
            </div>
          )}

          {!!firstName && (
            <div className="input-field familyName">
              <input
                name="familyName"
                id="icon_prefix"
                type="text"
                className="validate"
                value={userFamilyName}
                onChange={this.handleChange}
              />
              <label htmlFor="icon_prefix" className="active">
                Family Name
              </label>
            </div>
          )}
        </div>

        {!!kidGrade && (
          <div className="schoolGrade">
            <label>Grade</label>
            <select
              name="kidGrade"
              className="browser-default"
              value={kidGrade}
              onChange={this.handleChange}
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
        )}

        {!!index && (
          <div className="columnContainer schoolGrade">
            {mediaObject.tags.map(tag => (
              <div key={tag} className="chip">
                {tag}
                <i className="close material-icons">close</i>
              </div>
            ))}
          </div>
        )}
      </form>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    firstName: getFirstName(state, props),
    userFamilyName: getUserFamilyName(state, props),
    kidGrade: getKidGrade(state, props),
    mediaObject: getMediaObject(state, props)
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ modifyUser, modifyMedia }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(InputForm);

InputForm.propTypes = {
  userId: PropTypes.string,
  firstName: PropTypes.string,
  userFamilyName: PropTypes.string,
  kidGrade: PropTypes.string,
  mediaObject: PropTypes.object,
  index: PropTypes.number
};

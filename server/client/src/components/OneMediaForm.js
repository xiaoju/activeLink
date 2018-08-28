import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { getLastMediaValid } from '../selectors';
import { modifyMedia, addMediaRow } from '../actions/index';
import SelectComponentStyled from './SelectComponentStyled';

class OneMediaForm extends Component {
  constructor(props) {
    super(props);
    this.handleMediaChange = this.handleMediaChange.bind(this);
    this.handleOnBlurEvent = this.handleOnBlurEvent.bind(this);
  }

  handleOnBlurEvent(event) {
    this.props.lastMediaValid && this.props.addMediaRow();
  }

  handleMediaChange(event) {
    this.props.modifyMedia({
      index: this.props.index,
      value: event.target.value.trim().toLowerCase()
    });
  }

  render() {
    const {
      index, // index of this record inside the familyMedia array
      media, // 'email' or 'phone', ortherwise means 'not yet set'
      value, // the email of phone number itself
      tags, // the tags that applies to this
      caption, // first line of the label
      valueExample, // second line of the label
      isDisabled, // impossible to type, field is read only
      tagOptions // the list of choices that can be selected
    } = this.props;

    return (
      <form className="formInputsContainer">
        <div className="input-field twoNamesContainer">
          <i
            className={
              'material-icons prefix ' +
              (media === 'more_horiz' ? 'icon-orange' : '')
            }
          >
            {media}
          </i>
          <input
            readOnly={this.props.isDisabled}
            value={value}
            id={'media' + index}
            name={media}
            className={!value ? 'pasValide' : ' '}
            // onChange={!isDisabled && this.handleMediaChange}
            onChange={!isDisabled ? this.handleMediaChange : undefined}
            onBlur={this.handleOnBlurEvent}
          />
          <label htmlFor={'media' + index} className="double-line-label active">
            {caption}
            <br />
            <em>
              {!isDisabled && 'e.g.: '}
              {valueExample}
            </em>
          </label>
        </div>
        <SelectComponentStyled
          targetArray={'familyMedia'}
          index={index}
          tags={tags}
          options={tagOptions}
          isDisabled={isDisabled}
        />
      </form>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    lastMediaValid: getLastMediaValid(state)
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ modifyMedia, addMediaRow }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(OneMediaForm);

OneMediaForm.propTypes = {
  isDisabled: PropTypes.bool,
  caption: PropTypes.string.isRequired,
  valueExample: PropTypes.string,
  index: PropTypes.number, // 'index' is not required if field is read-only
  tagOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    }).isRequired
  ).isRequired
};

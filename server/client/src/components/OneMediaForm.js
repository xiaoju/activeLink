import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import {
  getMediaObject,
  getLastMediaValid,
  getMediaTagOptions
} from '../selectors';
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
      index,
      mediaObject: { media, value, tags },
      mediaTagOptions
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
            id={'media' + index}
            name={media}
            className={!value ? 'pasValide' : ' '}
            value={value}
            onChange={this.handleMediaChange}
            onBlur={this.handleOnBlurEvent}
          />
          <label htmlFor={'media' + index} className="double-line-label active">
            Email or phone number<br />
            <em>e.g.: my.name@example.com or 0612345678</em>
          </label>
        </div>
        <SelectComponentStyled
          targetArray={'familyMedia'}
          index={index}
          tags={tags}
          options={mediaTagOptions}
        />
      </form>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    mediaObject: getMediaObject(state, props),
    lastMediaValid: getLastMediaValid(state),
    mediaTagOptions: getMediaTagOptions(state)
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ modifyMedia, addMediaRow }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(OneMediaForm);

OneMediaForm.propTypes = {
  index: PropTypes.number.isRequired,
  mediaTagOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    }).isRequired
  ).isRequired,
  mediaObject: PropTypes.shape({
    media: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired
  }).isRequired
};

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { getMediaObject } from '../selectors';
import { modifyMedia } from '../actions/index';
import SelectComponentStyled from './SelectComponentStyled';

class OneMediaForm extends Component {
  constructor(props) {
    super(props);
    this.handleMediaChange = this.handleMediaChange.bind(this);
  }

  handleMediaChange(event) {
    this.props.modifyMedia({
      index: this.props.index,
      value: event.target.value.toLowerCase()
    });
  }

  render() {
    const { index, mediaObject: { media, value, tags } } = this.props;

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
            // className="validate"
            value={value}
            onChange={this.handleMediaChange}
          />
          <label htmlFor={'media' + index} className="active">
            Email or phone number
          </label>
        </div>
        <SelectComponentStyled index={index} />
        {/* <div className="columnContainer tagsContainer">

        </div> */}
      </form>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    mediaObject: getMediaObject(state, props)
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ modifyMedia }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(OneMediaForm);

OneMediaForm.propTypes = {
  mediaObject: PropTypes.object.isRequired,
  media: PropTypes.string,
  value: PropTypes.string,
  tags: PropTypes.array,
  index: PropTypes.number.isRequired
};

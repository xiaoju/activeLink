import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { getLastAddressValid } from '../selectors';
import { modifyAddress, addAddressRow } from '../actions/index';
import SelectComponentStyled from './SelectComponentStyled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class OneAddressForm extends Component {
  constructor(props) {
    super(props);
    this.handleAddressChange = this.handleAddressChange.bind(this);
    this.handleOnBlurEvent = this.handleOnBlurEvent.bind(this);
  }

  handleOnBlurEvent(event) {
    this.props.lastAddressValid && this.props.addAddressRow();
  }

  handleAddressChange(event) {
    this.props.modifyAddress({
      index: this.props.index,
      value: event.target.value
    });
  }

  render() {
    const {
      index,
      value,
      tags,
      tagOptions,
      caption,
      valueExample
    } = this.props;

    return (
      <form className="formInputsContainer">
        <div className="input-field twoNamesContainer">
          <FontAwesomeIcon
            style={{ transform: 'translate(-30%, 18%)' }}
            className="prefix"
            icon="home"
            color={value === '' ? '#ffa726' : ''}
            size="1x"
          />
          <input
            id={'address' + index}
            name="address"
            className={!value ? 'pasValide' : ' '}
            value={value}
            style={{ paddingTop: '1em' }}
            onChange={this.handleAddressChange}
            onBlur={this.handleOnBlurEvent}
          />
          <label
            htmlFor={'address' + index}
            className="double-line-label active"
          >
            {caption}
            <br />
            <em>e.g.: {valueExample}</em>
          </label>
        </div>
        <SelectComponentStyled
          targetArray={'addresses'}
          index={index}
          tags={tags}
          options={tagOptions}
        />
      </form>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    lastAddressValid: getLastAddressValid(state)
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ modifyAddress, addAddressRow }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(OneAddressForm);

OneAddressForm.propTypes = {
  value: PropTypes.string.isRequired,
  tags: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  caption: PropTypes.string.isRequired,
  valueExample: PropTypes.string,
  index: PropTypes.number.isRequired
};

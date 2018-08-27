import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { getLastAddressValid } from '../selectors';
import { modifyAddress, addAddressRow } from '../actions/index';
import SelectComponentStyled from './SelectComponentStyled';

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

    // const tagOptions = [
    //   { value: 'everybody', label: 'everybody!' },
    //   { value: 'Donald', label: 'Donald' },
    //   { value: 'Rosemary', label: 'Rosemary' }
    // ];

    return (
      <form className="formInputsContainer">
        <div className="input-field twoNamesContainer">
          <i
            className={
              'material-icons prefix ' + (value === '' ? 'icon-orange' : '')
            }
          >
            home
          </i>
          <input
            id={'address' + index}
            name="address"
            // placeholder="1 place du Capitole, 31000 Toulouse FRANCE"
            className={!value ? 'pasValide' : ' '}
            value={value}
            style={{ paddingTop: '1em' }}
            onChange={this.handleAddressChange}
            onBlur={this.handleOnBlurEvent}
          />
          <label
            htmlFor={'address' + index}
            // style={{ lineHeight: '1em' }}
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

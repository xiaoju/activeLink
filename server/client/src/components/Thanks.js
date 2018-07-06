import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getReceipt } from '../selectors';
import SpinnerWrapper from './SpinnerWrapper';
import OrderReceipt from './OrderReceipt';
import CallForVolunteers from './CallForVolunteers';

class Thanks extends Component {
  render() {
    const { receipt } = this.props;

    return (
      <div>
        {!receipt ? (
          <div>
            <h4>Processing your order...</h4>
            <br />
            <SpinnerWrapper />
          </div>
        ) : (
          <div>
            <OrderReceipt receipt={receipt} />
            <CallForVolunteers />
          </div>
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    receipt: getReceipt(state)
  };
}

export default connect(mapStateToProps)(Thanks);

Thanks.propTypes = {
  receipt: PropTypes.object.isRequired
};

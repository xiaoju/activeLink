import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getReceipt } from '../selectors';
import SpinnerWrapper from './SpinnerWrapper';
import OrderReceipt from './OrderReceipt';

class Thanks extends Component {
  render() {
    const { receipt } = this.props;

    return (
      <div>
        {!receipt ? (
          <div>
            <SpinnerWrapper caption="Processing your order..." />
          </div>
        ) : (
          <div>
            <OrderReceipt receipt={receipt} />
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

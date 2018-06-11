import React, { Component } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import { connect } from 'react-redux';
import { totalObject } from '../selectors';

class Payments extends Component {
  render() {
    return (
      <StripeCheckout
        name="English Link"
        description="2018-2019 registrations"
        amount={this.props.totalObject.total}
        token={token => this.props.handleToken(token)}
        stripeKey={process.env.REACT_APP_STRIPE_KEY}
      >
        <a className="waves-effect waves-light btn-large orange lighten-1">
          <i className="material-icons left">shopping_cart</i>
          {this.props.totalObject.total / 100} &euro;
        </a>
      </StripeCheckout>
    );
  }
}

function mapStateToProps(state) {
  return {
    data: state.data,
    checked: state.checked,
    totalObject: totalObject(state)
  };
}

export default connect(
  mapStateToProps
  // mapDispatchToProps
)(Payments);

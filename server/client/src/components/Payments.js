import React, { Component } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import { connect } from 'react-redux';
import * as actions from '../actions';

class Payments extends Component {
  render() {
    return (
      <StripeCheckout
        name="English Link"
        description="2018-2019 registrations"
        amount={25500}
        token={token => this.props.handleToken(token)}
        stripeKey={process.env.REACT_APP_STRIPE_KEY}
      >
        <a className="waves-effect waves-light btn-large orange lighten-1">
          <i className="material-icons left">shopping_cart</i>255 &euro;
        </a>
      </StripeCheckout>
    );
  }
}

export default connect(null, actions)(Payments);

// {this.props.registrationForm.totalPrice}

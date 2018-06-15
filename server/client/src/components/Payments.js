import React, { Component } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import { connect } from 'react-redux';
import { total, applyDiscount } from '../selectors';

class Payments extends Component {
  componentDidUpdate() {
    console.log('payments: component did update');
    this.props.data && console.log('applyDiscount: ', this.props.applyDiscount);
  }

  render() {
    return (
      <StripeCheckout
        name="English Link"
        description="2018-2019 registrations"
        amount={this.props.total / 100}
        token={token => this.props.handleToken(token)}
        stripeKey={process.env.REACT_APP_STRIPE_KEY}
      >
        <a className="waves-effect waves-light btn-large orange lighten-1">
          <i className="material-icons left">shopping_cart</i>
          {this.props.total / 100} &euro;
        </a>
      </StripeCheckout>
    );
  }
}

function mapStateToProps(state) {
  return {
    data: state.data,
    checked: state.checked,
    total: total(state),
    applyDiscount: applyDiscount(state)
  };
}

export default connect(mapStateToProps)(Payments);

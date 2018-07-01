import React, { Component } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import { connect } from 'react-redux';
import { getTotal, getApplyDiscount, getFormIsValid } from '../selectors';
import ValidationPanel from './ValidationPanel';

class Payments extends Component {
  render() {
    return (
      <div>
        {this.props.formIsValid.formIsValid ? (
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
        ) : (
          <a className="btn-large disabled">
            <i className="material-icons left">shopping_cart</i>
            {this.props.total / 100} &euro;
          </a>
        )}
        <ValidationPanel />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    data: state.data,
    checked: state.checked,
    total: getTotal(state),
    applyDiscount: getApplyDiscount(state),
    formIsValid: getFormIsValid(state)
  };
}

export default connect(mapStateToProps)(Payments);

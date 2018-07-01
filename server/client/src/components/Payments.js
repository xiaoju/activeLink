import React, { Component } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import { connect } from 'react-redux';
import { getTotal, getApplyDiscount, getFormIsValid } from '../selectors';

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
        <div className="card-panel orange lighten-1 validationMessage">
          {!this.props.formIsValid.totalNotZero && (
            <p>
              Please select the items you want to purchase by clicking on the
              orange checkboxes (see "step 2" section).
            </p>
          )}
          {!this.props.formIsValid.oneEmailMini && (
            <p>Please enter at least one valid Email in section 1.</p>
          )}
          {!this.props.formIsValid.onePhoneMini && (
            <p>Please enter at least one valid phone number (section 1).</p>
          )}
          {!this.props.formIsValid.oneKidMini && (
            <p>
              Please enter in section 1 the data for at least 1 kid: first name,
              family name and school grade.
            </p>
          )}
          {!this.props.formIsValid.oneParentMini && (
            <p>
              In section 1, please enter first name and family name for at least
              1 parent.
            </p>
          )}
        </div>
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

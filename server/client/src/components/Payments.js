import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import StripeCheckout from 'react-stripe-checkout';
import { connect } from 'react-redux';
import {
  getFamilyId,
  getEventId,
  getValidKids,
  getValidParents,
  getValidAddresses,
  getValidMedia,
  getValidFamilyById,
  getValidChecked,
  getTotal,
  getFormIsValid,
  getMainEmail,
  getEventName,
  getEventProviderName
} from '../selectors';
import { handlePayment } from '../actions/index';
import ValidationPanel from './ValidationPanel';

class Payments extends Component {
  render() {
    const {
      familyId,
      eventId,
      validKids,
      validParents,
      validAddresses,
      validMedia,
      validFamilyById,
      validChecked,
      total,
      formIsValid,
      mainEmail,
      eventName,
      eventProviderName
    } = this.props;

    return (
      <div>
        {formIsValid.consolidated ? (
          <StripeCheckout
            name={eventProviderName}
            description={eventName}
            allowRememberMe={false}
            amount={total}
            email={mainEmail}
            receipt_email={mainEmail}
            currency="EUR"
            stripeKey={process.env.REACT_APP_STRIPE_KEY}
            token={stripeToken => {
              // console.log('stripeToken: ', stripeToken);
              this.props.handlePayment({
                stripeToken,
                familyId,
                eventId,
                validKids,
                validParents,
                validAddresses,
                validMedia,
                validFamilyById,
                validChecked,
                total
              });
            }}
          >
            <a className="waves-effect waves-light btn-large orange lighten-1">
              <i className="material-icons left">shopping_cart</i>
              {total / 100} &euro;
            </a>
          </StripeCheckout>
        ) : (
          <a className="btn-large disabled">
            <i className="material-icons left">shopping_cart</i>
            {total / 100} &euro;
          </a>
        )}
        <ValidationPanel />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    familyId: getFamilyId(state),
    eventId: getEventId(state),
    validKids: getValidKids(state),
    validParents: getValidParents(state),
    validAddresses: getValidAddresses(state),
    validMedia: getValidMedia(state),
    validFamilyById: getValidFamilyById(state),
    validChecked: getValidChecked(state),
    total: getTotal(state),
    formIsValid: getFormIsValid(state),
    mainEmail: getMainEmail(state),
    eventName: getEventName(state),
    eventProviderName: getEventProviderName(state)
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ handlePayment }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Payments);

Payments.propTypes = {
  familyId: PropTypes.string.isRequired,
  eventId: PropTypes.string.isRequired,
  validKids: PropTypes.array.isRequired,
  validParents: PropTypes.array.isRequired,
  validMedia: PropTypes.array.isRequired,
  validFamilyById: PropTypes.object.isRequired,
  validChecked: PropTypes.object.isRequired,
  total: PropTypes.number.isRequired,
  handlePayment: PropTypes.func.isRequired,
  formIsValid: PropTypes.objectOf(PropTypes.bool).isRequired,
  mainEmail: PropTypes.string.isRequired,
  eventName: PropTypes.string.isRequired,
  eventProviderName: PropTypes.string.isRequired
};

import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { handlePayment } from '../actions/index';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import StripeCheckout from 'react-stripe-checkout';

class Payment extends Component {
  renderTopLabel = () => (
    <label htmlFor="payment" className="active">
      <p>
        {
          {
            moneyCheque: 'By cheque,',
            bankTransfer: 'By bank transfer,',
            creditCard: 'By Credit card,',
            null: 'Total'
          }[this.props.paymentOption]
        }
        <br />
        {this.props.paymentOption
          ? this.props.installmentsQuantity +
            ' installment' +
            (this.props.installmentsQuantity > 1 ? 's' : '')
          : ''}
      </p>
    </label>
  );

  renderBottomLabel = () => (
    <label htmlFor="payment" className="active">
      <p>
        {
          {
            moneyCheque: 'Press this button to save your inputs',
            bankTransfer: 'Press this button to save your inputs',
            creditCard: 'Press this button to proceed to credit card payment',
            null: ''
          }[this.props.paymentOption]
        }
      </p>
    </label>
  );

  renderIcon() {
    return (
      <FontAwesomeIcon
        style={{
          marginRight: '2em'
        }}
        icon={
          {
            creditCard: 'credit-card',
            bankTransfer: 'exchange-alt',
            moneyCheque: 'money-check',
            null: 'shopping-cart'
          }[this.props.paymentOption]
        }
        size="1x"
      />
    );
  }

  render() {
    const {
      paymentOption,
      installmentsQuantity,
      photoConsent,
      familyId,
      eventId,
      validKids,
      validParents,
      validAddresses,
      validMedia,
      validFamilyById,
      validChecked,
      total,
      primaryEmail,
      eventName,
      eventProviderName,
      formIsValid
    } = this.props;

    return (
      <div>
        {this.renderTopLabel()}

        {paymentOption === 'creditCard' ? (
          <StripeCheckout
            name={eventProviderName}
            description={eventName}
            locale="en"
            image={
              process.env.NODE_ENV === 'production'
                ? 'englishLinkLogo.png'
                : 'http://www.englishlinkcaousou.fr/s/cc_images/teaserbox_55471588.png'
            }
            allowRememberMe={false}
            amount={total}
            email={primaryEmail}
            receipt_email={primaryEmail}
            currency="EUR"
            stripeKey={
              (window && window.location && window.location.hostname) ===
              'activelink-staging.herokuapp.com'
                ? 'pk_test_5OWVaftUwORDieoDZbQfHPDM'
                : process.env.REACT_APP_STRIPE_KEY
            }
            token={stripeToken => {
              this.props.handlePayment({
                paymentOption,
                installmentsQuantity,
                stripeToken,
                familyId,
                eventId,
                validKids,
                validParents,
                validAddresses,
                validMedia,
                validFamilyById,
                validChecked,
                photoConsent,
                total
              });
            }}
          >
            <a className="waves-effect waves-light btn-large orange lighten-1">
              {this.renderIcon()}
              {installmentsQuantity}
              {' x '}
              {Math.ceil(total / 100 / installmentsQuantity)} &euro;
            </a>
          </StripeCheckout>
        ) : (
          <button
            onClick={() => {
              this.props.handlePayment({
                paymentOption,
                installmentsQuantity,
                stripeToken: null,
                familyId,
                eventId,
                validKids,
                validParents,
                validAddresses,
                validMedia,
                validFamilyById,
                validChecked,
                photoConsent,
                total
              });
            }}
            className={
              formIsValid.consolidated
                ? 'waves-effect waves-light btn-large orange lighten-1'
                : 'btn-large disabled'
            }
            type="submit"
            name="payment"
          >
            <FontAwesomeIcon
              style={{
                marginRight: '2em'
              }}
              icon={
                {
                  creditCard: 'credit-card',
                  bankTransfer: 'exchange-alt',
                  moneyCheque: 'money-check',
                  null: 'shopping-cart'
                }[paymentOption]
              }
              size="1x"
            />
            {installmentsQuantity}
            {' x '}
            {Math.ceil(total / 100 / installmentsQuantity)} &euro;
          </button>
        )}
        {this.renderBottomLabel()}
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ handlePayment }, dispatch);
}

export default connect(null, mapDispatchToProps)(Payment);

Payment.propTypes = {
  paymentOption: PropTypes.string,
  installmentsQuantity: PropTypes.number.required,
  photoConsent: PropTypes.bool.isRequired,
  familyId: PropTypes.string.isRequired,
  eventId: PropTypes.string.isRequired,
  validKids: PropTypes.array.isRequired,
  validParents: PropTypes.array.isRequired,
  validMedia: PropTypes.array.isRequired,
  validFamilyById: PropTypes.object.isRequired,
  validChecked: PropTypes.object.isRequired,
  total: PropTypes.number.isRequired,
  handlePayment: PropTypes.func.isRequired,
  primaryEmail: PropTypes.string.isRequired,
  eventName: PropTypes.string.isRequired,
  eventProviderName: PropTypes.string.isRequired,
  formIsValid: PropTypes.objectOf(PropTypes.bool).isRequired
};

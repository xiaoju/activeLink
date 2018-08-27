import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import StripeCheckout from 'react-stripe-checkout';
import { connect } from 'react-redux';
import {
  getAssoIconLink,
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
  getPrimaryEmail,
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
      primaryEmail,
      eventName,
      eventProviderName
    } = this.props;

    return (
      <div>
        {formIsValid.consolidated ? (
          <StripeCheckout
            name={eventProviderName}
            description={eventName}
            image={
              'http://www.englishlinkcaousou.fr/s/cc_images/teaserbox_55471588.png'
            }
            // image={'%PUBLIC_URL%/englishLinkLogo.png'}
            allowRememberMe={false}
            amount={total}
            email={primaryEmail}
            receipt_email={primaryEmail}
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
    assoIconLink: getAssoIconLink(state),
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
    primaryEmail: getPrimaryEmail(state),
    eventName: getEventName(state),
    eventProviderName: getEventProviderName(state)
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ handlePayment }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Payments);

Payments.propTypes = {
  assoIconLink: PropTypes.string.isRequired,
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
  primaryEmail: PropTypes.string.isRequired,
  eventName: PropTypes.string.isRequired,
  eventProviderName: PropTypes.string.isRequired
};

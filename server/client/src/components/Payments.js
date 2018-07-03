import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import StripeCheckout from 'react-stripe-checkout';
import { connect } from 'react-redux';
import {
  getTotal,
  getFormIsValid,
  getMainEmail,
  getFamilyId,
  getEventId,
  getEventName,
  getEventProviderName,
  getValidKids,
  getValidParents,
  getValidMedia,
  getValidFamilyPerId,
  getValidChecked
} from '../selectors';
import { handleToken } from '../actions/index';
import ValidationPanel from './ValidationPanel';

class Payments extends Component {
  // constructor(props) {
  //   super(props);
  //   this.handleOnOpened = this.handleOnOpened.bind(this);
  // }
  //
  // handleOnOpened(event, payload) {
  //   console.log('export data: ', payload);
  // }

  render() {
    const {
      total,
      formIsValid,
      mainEmail,
      familyId,
      eventId,
      eventName,
      eventProviderName,
      validKids,
      validParents,
      validMedia,
      validFamilyPerId,
      validChecked
    } = this.props;
    let exportData = {
      familyId,
      eventId,
      validKids,
      validParents,
      validMedia,
      validFamilyPerId,
      validChecked
    };

    return (
      <div>
        {formIsValid.consolidated ? (
          <StripeCheckout
            name={eventProviderName}
            allowRememberMe={false}
            description={eventName}
            amount={total}
            email={mainEmail}
            currency="EUR"
            token={token => {
              // console.log('Stripe token: ', token);
              this.props.handleToken(token);
            }}
            // token={token => console.log(token)}
            // opened={this.handleOnOpened}
            // opened={() =>
            //   console.log(
            //     exportData,
            //     'timeStamp: ',
            //     // new Date(Date.now()).toLocaleString()
            //     Date.now()
            //   )
            // }
            stripeKey={process.env.REACT_APP_STRIPE_KEY}
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
    total: getTotal(state),
    formIsValid: getFormIsValid(state),
    mainEmail: getMainEmail(state),
    familyId: getFamilyId(state),
    eventId: getEventId(state),
    eventName: getEventName(state),
    eventProviderName: getEventProviderName(state),
    validKids: getValidKids(state),
    validParents: getValidParents(state),
    validMedia: getValidMedia(state),
    validFamilyPerId: getValidFamilyPerId(state),
    validChecked: getValidChecked(state)
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ handleToken }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Payments);

Payments.propTypes = {
  handleToken: PropTypes.func.isRequired,
  total: PropTypes.number.isRequired,
  formIsValid: PropTypes.objectOf(PropTypes.bool).isRequired,
  mainEmail: PropTypes.string.isRequired,
  familyId: PropTypes.string.isRequired,
  eventId: PropTypes.string.isRequired,
  eventName: PropTypes.string.isRequired,
  eventProviderName: PropTypes.string.isRequired,
  validKids: PropTypes.array.isRequired,
  validParents: PropTypes.array.isRequired,
  validMedia: PropTypes.array.isRequired,
  validFamilyPerId: PropTypes.object.isRequired,
  validChecked: PropTypes.object.isRequired
};

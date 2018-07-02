import React, { Component } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import { connect } from 'react-redux';
import {
  getTotal,
  getFormIsValid,
  getFamilyId,
  getEventId,
  getValidKids,
  getValidParents,
  getValidMedia,
  getValidFamilyPerId,
  getValidChecked
} from '../selectors';
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
      familyId,
      eventId,
      validKids,
      validParents,
      validMedia,
      validFamilyPerId,
      validChecked
    } = this.props;
    const exportData = {
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
            name="English Link"
            description="2018-2019 registration"
            amount={total}
            currency="EUR"
            token={token => this.props.handleToken(token)}
            // opened={this.handleOnOpened}
            opened={() => console.log(exportData)}
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

    familyId: getFamilyId(state),
    eventId: getEventId(state),
    validKids: getValidKids(state),
    validParents: getValidParents(state),
    validMedia: getValidMedia(state),
    validFamilyPerId: getValidFamilyPerId(state),
    validChecked: getValidChecked(state)
  };
}

export default connect(mapStateToProps)(Payments);

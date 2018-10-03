import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import PageSection from './layout/PageSection';
import { selectPaymentOption } from '../actions/index';
import {
  getEventId,
  getFamilyId,
  getPaymentOption,
  getEventProviderName,
  getBankReference,
  getTotal
} from '../selectors';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class SelectPaymentOption extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.props.selectPaymentOption({
      paymentOption: event.target.name,
      installmentsQuantity: event.target.value * 1
    });
  }

  render() {
    const {
      eventId,
      familyId,
      sectionTitle,
      paymentOption,
      total,
      bankReference,
      eventProviderName
    } = this.props;

    return (
      <PageSection sectionTitle={sectionTitle}>
        <form checked={paymentOption}>
          <ul className="radioList container">
            <li>
              <input
                checked={paymentOption === 'creditCard'}
                onChange={this.handleChange}
                className="with-gap"
                id="creditCard"
                name="creditCard"
                type="radio"
                value={1}
              />

              <label htmlFor="creditCard">
                <div className="radioLabelDiv">
                  <FontAwesomeIcon
                    icon="credit-card"
                    color={paymentOption === 'creditCard' ? '#ffa726' : 'fff'}
                    size="2x"
                  />

                  {paymentOption === 'creditCard' ? (
                    <div style={{ color: '#ffa726' }}>
                      <strong>Credit card</strong>
                      <ul className="browser-default">
                        <li>1 payment of {Math.ceil(total / 100)} &euro;</li>
                        <li>
                          Securely processed by 'stripe.com', with encrypted
                          connections to the servers.
                        </li>
                        <li>
                          '{eventProviderName}' doesn't see credit card numbers
                          nor passwords.
                        </li>
                      </ul>
                    </div>
                  ) : (
                    <div>
                      <strong>Credit card</strong>
                      <ul className="browser-default">
                        <li>1 payment of {Math.ceil(total / 100)} &euro;</li>
                        <li>
                          Securely processed by 'stripe.com', with encrypted
                          connections to the servers.
                        </li>
                        <li>
                          '{eventProviderName}' doesn't see credit card numbers
                          nor passwords.
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </label>
            </li>
            <li>
              <input
                checked={paymentOption === 'bankTransfer'}
                onChange={this.handleChange}
                className="with-gap"
                id="bankTransfer"
                name="bankTransfer"
                type="radio"
                value={3}
              />
              <label htmlFor="bankTransfer">
                <div className="radioLabelDiv">
                  <FontAwesomeIcon
                    icon="exchange-alt"
                    color={paymentOption === 'bankTransfer' ? '#ffa726' : 'fff'}
                    size="2x"
                  />
                  {paymentOption === 'bankTransfer' ? (
                    <div style={{ color: '#ffa726' }}>
                      <strong>Bank transfer</strong>
                      <ul className="browser-default">
                        <li>
                          3 payments of {Math.ceil(total / 300)} &euro; each
                        </li>
                        <li>
                          Arrange yourself the payment per bank transfer from
                          your bank to the association.
                        </li>
                        <li>
                          Dates:{' '}
                          <strong>today, february 1st, april 1st.</strong>
                        </li>
                        <li>
                          Account name:{' '}
                          <strong>{bankReference[0].AccountName}</strong>
                        </li>
                        <li>
                          IBAN: <strong>{bankReference[0].IBAN}</strong>
                        </li>
                        <li>
                          BIC: <strong>{bankReference[0].BIC}</strong>
                        </li>
                        <li>
                          Bank: <strong>{bankReference[0].BankName}</strong>
                        </li>
                        <li>
                          Reference:{' '}
                          <strong>
                            {(
                              eventId +
                              '-' +
                              familyId.slice(0, 4) +
                              '-' +
                              familyId.slice(4, 8)
                            ).toUpperCase()}
                          </strong>
                        </li>
                      </ul>
                    </div>
                  ) : (
                    <div>
                      <strong>Bank transfer</strong>
                      <ul className="browser-default">
                        <li>
                          3 payments of {Math.ceil(total / 300)} &euro; each
                        </li>
                        <li>
                          Arrange yourself the payment per bank transfer from
                          your bank to the association.
                        </li>
                        <li>
                          Dates:{' '}
                          <strong>today, february 1st, april 1st.</strong>
                        </li>
                        {/* TODO dont hardcode the dates*/}
                        <li>
                          Account name:{' '}
                          <strong>{bankReference[0].AccountName}</strong>
                        </li>
                        <li>
                          IBAN: <strong>{bankReference[0].IBAN}</strong>
                        </li>
                        <li>
                          BIC: <strong>{bankReference[0].BIC}</strong>
                        </li>
                        <li>
                          Bank: <strong>{bankReference[0].BankName}</strong>
                        </li>
                        <li>
                          Reference:{' '}
                          <strong>
                            {(
                              eventId +
                              '-' +
                              familyId.slice(0, 4) +
                              '-' +
                              familyId.slice(4, 8)
                            ).toUpperCase()}
                          </strong>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </label>
            </li>
            <li>
              <input
                checked={paymentOption === 'moneyCheque'}
                onChange={this.handleChange}
                className="with-gap"
                id="moneyCheque"
                name="moneyCheque"
                type="radio"
                value={3}
              />
              <label htmlFor="moneyCheque">
                <div className="radioLabelDiv">
                  <FontAwesomeIcon
                    icon="money-check"
                    color={paymentOption === 'moneyCheque' ? '#ffa726' : 'fff'}
                    size="2x"
                  />
                  {paymentOption === 'moneyCheque' ? (
                    <div style={{ color: '#ffa726' }}>
                      <strong>Cheque</strong>
                      <ul className="browser-default">
                        <li>
                          3 payments of {Math.ceil(total / 300)} &euro; each
                        </li>
                        <li>
                          Dates the cheques will be cashed:{' '}
                          <em>today, february 1st, april 1st,</em>
                        </li>
                        <li>
                          To the order of: <em>{eventProviderName}</em>
                        </li>
                        <li>
                          Object:{' '}
                          <strong>
                            {(
                              eventId +
                              '-' +
                              familyId.slice(0, 4) +
                              '-' +
                              familyId.slice(4, 8)
                            ).toUpperCase()}
                          </strong>
                        </li>
                        <li>
                          Cheques to be dropped in the mailbox of{' '}
                          {eventProviderName}.
                        </li>
                      </ul>
                    </div>
                  ) : (
                    <div>
                      <strong>Cheque</strong>
                      <ul className="browser-default">
                        <li>
                          3 payments of {Math.ceil(total / 300)} &euro; each
                        </li>
                        <li>
                          Dates the cheques will be cashed:{' '}
                          <em>today, february 1st, april 1st,</em>
                        </li>

                        <li>
                          To the order of: <em>{eventProviderName}</em>
                        </li>
                        <li>
                          Object:{' '}
                          <strong>
                            {(
                              eventId +
                              '-' +
                              familyId.slice(0, 4) +
                              '-' +
                              familyId.slice(4, 8)
                            ).toUpperCase()}
                          </strong>
                        </li>
                        <li>
                          Cheques to be dropped in the mailbox of{' '}
                          {eventProviderName}.
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </label>
            </li>
          </ul>
        </form>
      </PageSection>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ selectPaymentOption }, dispatch);
}

function mapStateToProps(state) {
  return {
    eventId: getEventId(state),
    familyId: getFamilyId(state),
    paymentOption: getPaymentOption(state),
    bankReference: getBankReference(state),
    total: getTotal(state),
    eventProviderName: getEventProviderName(state)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(
  SelectPaymentOption
);

SelectPaymentOption.propTypes = {
  eventId: PropTypes.string.isRequired,
  familyId: PropTypes.string.isRequired,
  sectionTitle: PropTypes.string.isRequired,
  paymentOption: PropTypes.string,
  total: PropTypes.number.isRequired,
  bankReference: PropTypes.array.isRequired,
  eventProviderName: PropTypes.string.isRequired
};

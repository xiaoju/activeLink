import React from 'react';
import PageSection from './layout/PageSection';

// TODO automatically log out, and remove from state what needs to

function OrderReceipt(props) {
  let {
    assoName,
    primaryEmail,
    eventName,
    applyDiscount,
    paymentOption,
    total,
    datesToPay,
    bankReference: { IBAN, BIC, AccountName, BankName },
    paymentReference,
    installmentsQuantity,
    chequeOrder,
    chequeCollection,
    timeStamp,
    currency,
    last4,
    status,
    chargeId
  } = props.receipt;

  return paymentOption !== 'creditCard' ? (
    <PageSection sectionTitle="⑧ Confirmation">
      <div className="itemDetails innerContainer">
        <p>
          Your pre-registration to {assoName}, {eventName}, is complete. <br />Thank
          you!<br />
          Please proceed with your first payment as soon as possible, <br />per
          cheque or bank transfer:
        </p>
      </div>
      <div className="itemDetails innerContainer">
        <h6>
          <strong>Payment per bank transfer: </strong>
        </h6>
        <ul>
          <li>
            {installmentsQuantity} payments of{' '}
            {Math.ceil(total / installmentsQuantity / 100)}&nbsp;&euro; each,
          </li>
          <li>
            on{' '}
            {datesToPay
              .map(timeStamp =>
                new Date(timeStamp * 1).toLocaleDateString('en-US', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })
              )
              .join(', ')}.
          </li>
          <li>
            <strong>or</strong> 1 payment of {Math.ceil(total / 100)}&nbsp;&euro;.
          </li>
          <li>Account name: {AccountName}</li>
          <li>Name of the bank: {BankName}</li>
          <li>IBAN: {IBAN}</li>
          <li>BIC: {BIC}</li>
          <li>
            Reference to write: <strong>{paymentReference}</strong>
          </li>
        </ul>
      </div>
      <div className="itemDetails innerContainer">
        <h6>
          <strong>Payment per cheque: </strong>
        </h6>
        <ul>
          <li>1 cheque of {Math.ceil(total / 100)}&nbsp;&euro;</li>
          <strong> or </strong>3 cheques of{' '}
          {Math.ceil(total / installmentsQuantity / 100)}&nbsp;&euro; each,
          <li>
            to the order of <strong>{chequeOrder}</strong>.
          </li>
          <li>
            Object: <strong>{paymentReference}</strong>
          </li>
          <li>{chequeCollection}</li>
        </ul>
      </div>
      <div className="itemDetails innerContainer">
        <p>
          We've sent an email to your address <strong>{primaryEmail}</strong>{' '}
          with this information. <br />
          You now can close this page.
        </p>
      </div>
    </PageSection>
  ) : (
    <PageSection sectionTitle="⑧ Order receipt">
      <div className="innerContainer">
        <p>
          This is your receipt. <br />
          We've sent a copy for you to <strong>{primaryEmail}</strong>.
        </p>
      </div>
      <div className="container orderSummary">
        <ul>
          <li>
            <strong>{assoName}</strong>
          </li>
          <li>
            <strong>{eventName}</strong>
          </li>
          <li>
            <strong>Receipt number: </strong>
            {chargeId}
          </li>
          <li>
            <strong>Credit card number: </strong>xxxx xxxx xxxx {last4}
          </li>
          <li>
            <strong>Total paid: </strong> {total / 100} {currency.toUpperCase()}
          </li>
          <li>{applyDiscount && 'Discount has been applied.'}</li>
          <li>
            <strong>Payment status: </strong>
            {status}
          </li>
          <li>
            <strong>Time: </strong>
            {new Date(1000 * timeStamp).toLocaleString()}
          </li>
        </ul>
      </div>
      <div className="itemDetails innerContainer">
        <p>
          Thank you for your registration and enjoy the activities!<br />
          You now can close this page.
        </p>
      </div>
    </PageSection>
  );
}

export default OrderReceipt;

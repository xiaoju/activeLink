import React from 'react';

function OrderReceipt(props) {
  let {
    allPurchasedToday,
    eventName,
    familyName,
    invoiceTotal,
    last4,
    paymentStatus,
    receiptTimeStamp
  } = props.receipt;
  return (
    <div>
      <h4>Thank you for your registration!</h4>
      <br />
      <h4>Order receipt:</h4>
      {eventName}
      <br />
      Name: {familyName}
      <br />
      {allPurchasedToday.map(obj => (
        <ul key={obj.id}>
          <li>
            Item: {obj.name}, {obj.period}
          </li>
          <li>Price: {obj.paidPrice / 100} &euro;</li>
          <li>
            {obj.beneficiaries.map((name, index) => (
              <span key={index}>{name} </span>
            ))}
          </li>
        </ul>
      ))}
      <br />
      Total paid: {invoiceTotal / 100} &euro;
      <br />
      Credit card number (last 4 digits): ...{last4}
      <br />
      Payment status: {paymentStatus}
      <br />
      Time: {receiptTimeStamp.toLocaleString()}
    </div>
  );
}

export default OrderReceipt;

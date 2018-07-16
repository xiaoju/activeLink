import React from 'react';

function OrderReceipt(props) {
  let {
    users, // [{id, firstName, familyName, kidGrade},{},...]
    allKids, // ['k0', 'k2']
    allParents, // ['p0', 'p1']
    familyMedia, // [{media: 'email', value: 'abc@abc.abc', tags: ['private']}, {media: 'phone', value: '12345', tags: []}]
    photoConsent, // false
    eventName, // 'this is the name'
    total, // 30000 (in cents)
    timeStamp, //12345432
    currency, // 'eur'
    last4, // '1234'
    status, // 'succeeded'
    chargeId, // 'abcd'
    registrations // [{k0: ['i2', 'i5']}, {...}]
  } = props.receipt;
  return (
    <div>
      <h4>Thank you for your registration!</h4>
      <br />
      <h4>Order receipt:</h4>
      Receipt number: {chargeId}
      <br />
      {eventName}
      <br />
      Profile:
      <br />
      kids
      {allKids.map(userId => (
        <p>
          {users[userId].firstName} {users[userId].familyName}{' '}
          {users[userId].kidGrade}
        </p>
      ))}
      <br />
      Parents
      {allParents.map(userId => (
        <p>
          {users[userId].firstName} {users[userId].familyName}
        </p>
      ))}
      <br />
      Phone and emails
      <br />
      {familyMedia.map(mediaObj => (
        <p>
          {mediaObj.media}
          {mediaObj.value} {mediaObj.tags.map(tag => <span>{tag} </span>)}
        </p>
      ))}
      <br />
      {/* {allPurchasedToday.map(obj => (
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
      ))} */}
      <br />
      Total paid: {total / 100} {currency}
      <br />
      Credit card number: xxxx xxxx xxxx {last4}
      <br />
      Payment status: {status}
      <br />
      Time: {new Date(1000 * timeStamp).toLocaleString()}
      <br />
      Photo consent: {photoConsent ? 'yes' : 'no'}
      <br />
      {/* Registrations:{' '}
      {registrations.map(registrationObj => (
        <p>
          {users[Object.keys(registrationObj)[0]].firstName}
          {Object.values(registrationObj)[0].map(tag => <span>{tag}</span>)}
        </p>
      ))} */}
    </div>
  );
}

export default OrderReceipt;

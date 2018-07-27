import React from 'react';

function OrderReceipt(props) {
  let {
    // familyId, // 'abcd'
    // users, // [{id, firstName, familyName, kidGrade},{},...]
    // allKids, // ['k0', 'k2']
    // allParents, // ['p0', 'p1']
    // addresses, // [{...}, {value: 'abc', tags: ['ab', 'de']}]
    // familyMedia, // [{media: 'email', value: 'abc@abc.abc', tags: ['private']}, {media: 'phone', value: '12345', tags: []}]
    // photoConsent, // false
    assoName,
    eventName, // 'this is the name'
    total, // 30000 (in cents)
    timeStamp, //12345432
    currency, // 'eur'
    last4, // '1234'
    status, // 'succeeded'
    chargeId, // 'abcd'
    applyDiscount // true
    // allPurchasedItems, // ['i0', 'i2', 'i7']
    // purchasedItemsById // { i0: {...}, i2: { id: 'i2', name: 'Knitting class', period: '2038-2039', paidPrice: 3000, beneficiaries: ['familyId', 'k7', 'p3'] } }
  } = props.receipt;
  return (
    <div>
      <div className="itemsContainer hoverable">
        <h4 className="stepTitle">⑦ Order receipt</h4>
        <h5>Thank you for your registration!</h5>
        <h5>You can now exit this page.</h5>
        <div className="orderSummary" style={{ margin: '2%' }}>
          <ul>
            <li>
              <strong>
                {assoName}, {eventName}
              </strong>
            </li>
            <li>
              <strong>Receipt number: </strong>
              {chargeId}
            </li>
            <li>
              <strong>Credit card number: </strong>xxxx xxxx xxxx {last4}
            </li>
            <li>
              <strong>Total paid: </strong> {total / 100}{' '}
              {currency.toUpperCase()}
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
          {/*
      <h5>Profile:</h5>
      <br />
      <strong>kids</strong>
      <ul>
        {allKids.map(userId => (
          <li key={userId}>
            {users[userId].firstName} {users[userId].familyName},{' '}
            {users[userId].kidGrade}
          </li>
        ))}
      </ul>
      <br />
      <strong>Parents</strong>
      <ul>
        {allParents.map(userId => (
          <li key={userId}>
            {users[userId].firstName} {users[userId].familyName}
          </li>
        ))}
      </ul>
      <br />
      <strong>Address</strong>
      <br />
      {addresses.map(addressObject => (
        <li key={addressObject.value}>
          {addressObject.media} (``{addressObject.tags.map(tag => (
            <span>{tag} </span>
          ))}): {addressObject.value}
        </li>
      ))}
      <br />
      <strong>Phone and emails</strong>
      <br />
      <ul>
        {familyMedia.map(mediaObj => (
          <li key={mediaObj.value}>
            {mediaObj.media} ( {mediaObj.tags.map(tag => <span>{tag} </span>)}):{' '}
            {mediaObj.value}
          </li>
        ))}
      </ul>
      <br />
      <strong>Photo consent: </strong>
      {allPurchasedItems.includes('i21')
        ? 'OK for pictures'
        : 'not OK for pictures'}
         */}

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

          {/*
      <strong>Purchased items: </strong>
      <div>
        {allPurchasedItems.map(itemId => (
          <div>
            <ul>
              <li>{purchasedItemsById[itemId].name}</li>
              <li>{purchasedItemsById[itemId].period}</li>
              <li>
                Price: {purchasedItemsById[itemId].paidPrice / 100}{' '}
                {currency === 'eur' ? 'EUR' : currency}
              </li>
            </ul>
            <ul>
              <strong>Beneficiaries: </strong>
              {purchasedItemsById[itemId].beneficiaries.map(userId => (
                <li>
                  {userId === familyId
                    ? 'The whole family'
                    : users[userId].firstName + ' ' + users[userId].familyName}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div> */}
        </div>
      </div>
    </div>
  );
}

export default OrderReceipt;

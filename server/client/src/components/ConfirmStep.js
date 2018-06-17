import React from 'react';
import Payments from './Payments';

function ConfirmStep({
  eventContactName,
  eventContactPhone,
  eventContactEmail
}) {
  return (
    <div className="itemsContainer hoverable">
      <h4 className="stepTitle">④ Confirm and pay</h4>
      <Payments />
      <div className="container">
        <p>
          Payments are securely processed by 'Stripe'. The connection to the
          servers is encrypted. English Link doesn't see credit card numbers
          neither passwords.
        </p>
        <p>
          Any questions? You can contact {eventContactName} per phone:{' '}
          {eventContactPhone} or email: {eventContactEmail}
        </p>
      </div>
    </div>
  );
}

export default ConfirmStep;

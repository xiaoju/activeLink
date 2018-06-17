import React from 'react';
import Payments from './Payments';

function ConfirmStep() {
  return (
    <div className="itemsContainer">
      <h4 className="stepTitle">④ Confirm and pay</h4>
      <Payments />
      <p>
        Payments are securely processed by 'Stripe'. The connection to the
        servers is encrypted. English Link doesn't see credit card numbers
        neither passwords.
      </p>
      <p>
        Any questions? You can contact Catherine Souchard per phone: 06 32 54 91
        62 or email: contactsecretary@englishlink.fr
      </p>
    </div>
  );
}

export default ConfirmStep;

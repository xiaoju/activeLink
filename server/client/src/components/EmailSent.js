import React from 'react';

function EmailSent(props) {
  return (
    <div className="itemsContainer hoverable">
      <div className="innerContainer">
        <h4 className="stepTitle">We sent you an email!</h4>
        <div className="title_and_button">
          <div>
            <p>
              We just sent an email to{' '}
              <code>{props.match.params.emailedTo}</code>
              , with a link to follow.
            </p>
            <p>
              That link will point to a page where you can set your new
              password.
            </p>
            <p>Don't forget to check your spam folder!</p>
            <p>You can now close this page.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmailSent;

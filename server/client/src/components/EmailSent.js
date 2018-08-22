import React from 'react';

function EmailSent() {
  return (
    <div className="itemsContainer hoverable">
      <div className="innerContainer">
        <h4 className="stepTitle">You can now close this page</h4>
        <div className="title_and_button">
          <strong>
            <h5>
              <p>We just sent you an email, with a link to follow. </p>
              <p>
                That link will point to a page where you can set your new
                password.
              </p>
            </h5>
          </strong>
        </div>
      </div>
    </div>
  );
}

export default EmailSent;

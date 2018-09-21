import React from 'react';
import PageSection from './layout/PageSection';

function EmailSent(props) {
  return (
    <PageSection sectionTitle="We sent you an email!">
      {/* <div className="innerContainer"> */}
      {/* <div className="title_and_button"> */}
      {/* <div> */}
      <p>
        We just sent an email to <code>{props.match.params.emailedTo}</code>
        , with a link to follow.
      </p>
      <p>That link will point to a page where you can set your new password.</p>
      <p>Don't forget to check your spam folder!</p>
      <p>You can now close this page.</p>
      {/* </div> */}
      {/* </div> */}
      {/* </div> */}
    </PageSection>
  );
}

export default EmailSent;

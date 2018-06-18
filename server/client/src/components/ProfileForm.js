import React, { Component } from 'react';
import OneKidForm from './OneKidForm';
import OneParentForm from './OneParentForm';
import TelephoneForm from './TelephoneForm';
import EmailForm from './EmailForm';

class ProfileForms extends Component {
  render() {
    return (
      <div className="itemsContainer hoverable">
        <h4 className="stepTitle">① Update your profile</h4>

        <h5>
          <strong>Kids</strong>
        </h5>

        <OneKidForm />
        <OneKidForm />
        <OneKidForm />

        <h5>
          <strong>Parents</strong>
        </h5>
        <span />

        <OneParentForm />
        <OneParentForm />

        {/* <h5>
          <strong>Email</strong>
        </h5> */}

        <EmailForm />

        {/* <h5>
          <strong>Telephone</strong>
        </h5> */}

        <TelephoneForm />
        {/* <button
          className="btn waves-effect waves-light orange lighten-1 z-depth-2"
          type="submit"
          name="action"
        >
          save
          <i className="material-icons right">send</i>
        </button> */}
      </div>
    );
  }
}

export default ProfileForms;

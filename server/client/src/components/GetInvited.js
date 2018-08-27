import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
// import { connect } from 'react-redux';
import ProfileForm from './ProfileForm';
// import RequestInvite from './RequestInvite';

class GetInvited extends Component {
  render() {
    return (
      <div class="container">
        <ProfileForm
          sectionTitle="Fill-in your profile information"
          sectionInstructions="To request an invitation to the Members Area, please fill in your
          details below then press the &quot;send&quot; button. We will come back to you to double check that access conditions are met."
        />

        {/* <RequestInvite
          sectionTitle="Send out your invitation request"
        /> */}
      </div>
    );
  }
}
export default GetInvited;

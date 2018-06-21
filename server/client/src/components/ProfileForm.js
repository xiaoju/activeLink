import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import OneKidForm from './OneKidForm';
import OnePhoneForm from './OnePhoneForm';
import OneEmailForm from './OneEmailForm';

class ProfileForm extends Component {
  render() {
    const { parents, kids, familyEmails, familyPhones, profile } = this.props;

    return (
      <div className="itemsContainer hoverable">
        <h4 className="stepTitle">① Update your profile</h4>
        <h5>
          <strong>Kids</strong>
        </h5>
        {kids.map(userId => <OneKidForm key={userId} userId={userId} />)}
        <h5>
          <strong>Parents</strong>
        </h5>

        {parents.map(userId => <OneKidForm key={userId} userId={userId} />)}

        {familyEmails.map(emailObject => (
          <OneEmailForm key={emailObject.it} emailObject={emailObject} />
        ))}

        {familyPhones.map(phoneObject => (
          <OnePhoneForm key={phoneObject.it} phoneObject={phoneObject} />
        ))}

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

function mapStateToProps(state) {
  return {
    profile: state.profile,
    parents: state.profile.parents,
    kids: state.profile.kids,
    familyEmails: state.profile.familyEmails,
    familyPhones: state.profile.familyPhones
  };
}

export default connect(mapStateToProps)(ProfileForm);

ProfileForm.propTypes = {
  profile: PropTypes.object.isRequired,
  parents: PropTypes.array.isRequired,
  kids: PropTypes.array.isRequired,
  familyEmails: PropTypes.array.isRequired,
  familyPhones: PropTypes.array.isRequired
};

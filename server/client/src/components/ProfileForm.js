import React, { Component } from 'react';
// import PropTypes from 'prop-types';

class ProfileForms extends Component {
  render() {
    return (
      <div className="itemsContainer">
        <h4 className="stepTitle">① Update your profile</h4>
        <h5>
          <strong>Parents</strong>
        </h5>
        <span />
        <ul>
          <li>mother (select mother/father/custom)</li>
          <li>First name</li>
          <li>Family name</li>
          <li>Adress</li>
          <li>Email</li>
          <li>
            Mobile phone (select mobile, landline, pro mobile, pro landline,
            perso mobile, person landline, custom)
          </li>
        </ul>

        <h5>
          <strong>Kids</strong>
        </h5>
        <ul>
          <li>First name</li>
          <li>Family name</li>
          <li>
            School grade (2018-2019) (select PS, MS, GS, CP, CE1, CE2, CM1, CM2)
          </li>
        </ul>

        <button
          className="btn waves-effect waves-light orange lighten-1 z-depth-2"
          type="submit"
          name="action"
        >
          save
          <i className="material-icons right">send</i>
        </button>
      </div>
    );
  }
}

export default ProfileForms;

// Events.propTypes = {
//   postId: PropTypes.string.isRequired
// };

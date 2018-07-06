import React, { Component } from 'react';
import { connect } from 'react-redux';
// import PropTypes from 'prop-types';

class CallForVolunteers extends Component {
  render() {
    return (
      <div>
        <h4>One more thing...</h4>
        <br />
        <div>
          <p>Name, surname, phone, email ==> to be selected from list.</p>
          <p>
            We are still in need of one to two more bureau members for the vital
            positions of Logistics Coordinators.
          </p>
          <p>
            Please let me know if you're interested in helping out to continue
            these activities that our children look forward to.
          </p>
          <p> Without your support, we may need to scale back.</p>
          <p>
            If you are unable to volunteer as a bureau member, don't despair -
            we can still use your help!
          </p>
          <p> No contribution is too small. </p>
          <p>
            Please fill out the attached volunteer form to indicate which events
            you can help with.
          </p>
          <p>I can help with the following activities:</p>
          <p>(Please check all that apply)</p>
          <p>___ Forum des Activities (early September)</p>
          <p>___ Welcome Breakfast (early September)</p>
          <p>___ Parent/Teacher Meeting (November)</p>
          <p>___ Fall/autumn Workshop</p>
          <p>___ Christmas Party</p>
          <p>___ Open Day (Jan/Feb)</p>
          <p>___ Spring Workshop</p>
          <p>
            ___ Theatre Performances (On Stage Theatre, Theatre Company) May
          </p>
          <p>___ Bake Sale</p>
          <p>___ Summer Workshop (Sports Day)</p>
          <p>___ Annual General Meeting/Garden Party (May)</p>
          <p>___ Bureau member: Logistics Coordinator</p>
          <p> Logistics Coordinator responsibilities include:</p>
          <ul>
            <li>- Lead the organization of the three workshops</li>
            <li>
              - Reserve the venues and lead the planning for the Christmas party
              and AGM/Garden Party
            </li>
            <li>- Coordinate tickets for the pantomime</li>
            <li>- Organize book covering sessions as necessary</li>
            <li>- Coordinate the cake sale</li>
            <p>
              The Bureau meets once a month in the evening to manage and plan
              activities.
            </p>
            <p>
              Meetings are held at the homes of the bureau members on a rotating
              basis.
            </p>
            <p>
              We are still in need of one to two more bureau members for the
              vital positions of Logistics Coordinators.
            </p>
          </ul>
          <p>Thank you! We'll call you back!</p>
          <p>The English Link does not exist without the support of parents!</p>
          <p>Looking forward to hearing from you.</p>
          <p>Carmen</p>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    // formIsValid: getFormIsValid(state)
  };
}

export default connect(mapStateToProps)(CallForVolunteers);

// CallForVolunteers.propTypes = {
// formIsValid: PropTypes.objectOf(PropTypes.bool).isRequired
// };

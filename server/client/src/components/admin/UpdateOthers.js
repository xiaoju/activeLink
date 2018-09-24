import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import * as actions from '../../actions';
import {
  getSelectedAsso,
  getSelectedEvent,
  getSelectedFamily,
  getProfile,
  getAdminAssos,
  getAssosById,
  getErrorMessage,
  getJsonProfiles
} from '../../selectors';
// import * as NewUsers from '../admin/primaryEmails';

class UpdateOthers extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    console.log('event.target.value: ', event.target.value);
    this.props.selectPrimaryEmail({
      // selectedFamily: event.target.value
      [event.target.name]: event.target.value
    });
  }

  render() {
    const {
      sectionTitle,

      selectedAsso,
      selectedEvent,
      selectedFamily,
      notYetRegisteredFamilies,

      errorMessage,

      jsonProfiles,
      profile,
      adminAssos,
      assosById
    } = this.props;

    return (
      <div className="itemsContainer hoverable">
        <h4 className="stepTitle">{sectionTitle}</h4>
        <div className="card-panel validationMessage">
          {errorMessage && (
            <strong>
              <p>{errorMessage}</p>
            </strong>
          )}
        </div>
        <h5>Profile input for the families who paid per cheque</h5>
        <h6 style={{ color: 'black' }}>The English Link</h6>

        <h6 style={{ color: 'black' }}>Registrations 2018-2019</h6>

        {/* <div className="schoolGrade">
          <label>Primary email</label>

          <select
            style={{ width: '80%', margin: '0 10%' }}
            name="selectedFamily"
            className={'browser-default'}
            value={selectedFamily}
            onChange={this.handleChange}
          >
            {NewUsers.NewUsers.map(obj => (
              <option key={obj.primaryEmail} value={obj.primaryEmail}>
                {obj.familyName} ( {obj.primaryEmail} )
              </option>
            ))}
          </select>
        </div> */}

        {/* <p>Number of cheques</p>
        <p>
          For each cheque: <br />
          Name: <br />
          Amount: <br />
          Cheque number: <br />
          Cheque date:
        </p> */}

        <div className="input-field loginEmail">
          <i className={'material-icons prefix icon-orange'}>send</i>
          <textarea
            name="jsonProfiles"
            value={jsonProfiles}
            onChange={this.handleChange}
            style={{
              marginTop: '2em',
              marginBottom: '1em',
              height: '14em'
            }}
          />
          <label
            htmlFor="jsonProfiles"
            className="double-line-label active"
            style={{ width: '100%' }}
          >
            Array of profiles in json format<br />
            <em styles={{ lineHeight: 'normal' }}>
              <p>{'e.g.:'}</p>
              <p>{'[{'}</p>
              <p>{"primaryEmail: 'abc@example.com',"}</p>
              <p>{"assoId: ['a0'],"}</p>
              <p>{'parents: [{firstName, familyName},{...}],'}</p>
              <p>{'children: [{firstName, familyName, kidGrade},{...}],'}</p>
              <p>{"photoConsent: 'true',"}</p>
              <p>{"familyMedia: ['a0'],"}</p>
              <p>{"addresses: ['a0'],"}</p>
              <p>{'},{...},{...}]'}</p>
            </em>
          </label>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    selectedAsso: getSelectedAsso(state),
    selectedEvent: getSelectedEvent(state),
    selectedFamily: getSelectedFamily(state),
    jsonProfiles: getJsonProfiles(state),
    profile: getProfile(state),
    adminAssos: getAdminAssos(state),
    assosById: getAssosById(state),
    errorMessage: getErrorMessage(state)
  };
}

export default connect(mapStateToProps, actions)(UpdateOthers);

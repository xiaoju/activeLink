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
  getErrorMessage
} from '../../selectors';
import * as NewUsers from '../admin/primaryEmails';

class SelectFamily extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    console.log('event.target.value: ', event.target.value);
    this.props.selectPrimaryEmail({
      selectedFamily: event.target.value
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
        <h5>Data input for the families who paid per cheque.</h5>
        <h6 style={{ color: 'black' }}>The English Link</h6>

        <h6 style={{ color: 'black' }}>Registrations 2018-2019</h6>

        <div className="schoolGrade">
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
        </div>

        {/* <p>Number of cheques</p>
        <p>
          For each cheque: <br />
          Name: <br />
          Amount: <br />
          Cheque number: <br />
          Cheque date:
        </p> */}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    selectedAsso: getSelectedAsso(state),
    selectedEvent: getSelectedEvent(state),
    selectedFamily: getSelectedFamily(state),
    profile: getProfile(state),
    adminAssos: getAdminAssos(state),
    assosById: getAssosById(state),
    errorMessage: getErrorMessage(state)
  };
}

export default connect(mapStateToProps, actions)(SelectFamily);

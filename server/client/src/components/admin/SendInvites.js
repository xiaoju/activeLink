import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import * as Validation from '../../utils/Validation';
import SpinnerWrapper from '../SpinnerWrapper';
import * as actions from '../../actions';
import { getProfile, getAdminAssos, getAssosById } from '../../selectors';

class sendInvites extends Component {
  constructor(props) {
    super(props);
    this.handleAssoChange = this.handleAssoChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.validateEmailsList = this.validateEmailsList.bind(this);
    // console.log('this.props.adminAssos: ', this.props.adminAssos);
    this.state = {
      showingForm: true,
      loadingResult: false,
      showingResult: false,
      emailsList: '',
      selectedAsso: 'a0',
      //   ? this.props.adminAssos.length > 1 ? '' : this.props.adminAssos[0]
      // TODO correct the line above to replace hardcoded 'a0'. Problem is that state.getProfile
      // is still undefined at time of loading this, and so the adminAssos is [].
      newEmails: [],
      newfamiliesByEmail: {},
      badFormatEmails: [],
      duplicateEmails: [],
      errorMessage: ''
    };
  }

  validateEmailsList(emailsList) {
    return emailsList
      .split(',')
      .map(emailString => emailString.trim())
      .map(email => Validation.validateEmail(email))
      .reduce((acc, curr) => acc & curr, true);
  }

  handleChange(event) {
    // console.log('event.target.name:', event.target.name);
    // console.log('event.target.value:', event.target.value);

    this.setState({ [event.target.name]: event.target.value });
    // console.log('selectedAsso: ', this.state.selectedAsso);
  }

  handleAssoChange(event) {
    this.setState({ selectedAsso: event.target.value });
  }

  async onSubmit(event) {
    event.preventDefault();
    this.setState({
      showingForm: false,
      loadingResult: true,
      showingResult: false
    });
    let emailsArray = this.state.emailsList
      .split(',')
      .map(string => string.trim());

    let result;
    try {
      // console.log('emailsArray: ', emailsArray);
      // console.log('selectedAsso: ', this.state.selectedAsso);
      result = await axios.put('/api/v1/createFamilies', {
        emailsArray,
        selectedAsso: this.state.selectedAsso
      });
    } catch (err) {
      console.log('SendInvites.js, ERROR by axios put createFamilies: ', err);
      this.setState({
        showingForm: true,
        loadingResult: false,
        showingResult: false,
        errorMessage:
          'Something went wrong, sorry about this! ERROR: ' +
          err.response.data.error
      });
      return;
    }

    let {
      newEmails,
      newfamiliesByEmail,
      badFormatEmails,
      duplicateEmails
    } = result.data;

    this.setState({
      showingForm: false,
      loadingResult: false,
      showingResult: true,
      newEmails,
      newfamiliesByEmail,
      badFormatEmails,
      duplicateEmails
    });
  }

  render() {
    const {
      showingForm,
      emailsList,
      loadingResult,
      showingResult,
      selectedAsso,
      newEmails,
      badFormatEmails,
      duplicateEmails,
      errorMessage
    } = this.state;

    const { profile, adminAssos, assosById } = this.props;

    return (
      <div>
        {loadingResult && (
          <div className="itemsContainer hoverable">
            <h4 className="stepTitle">Create accounts</h4>
            <div className="container itemDetails">
              <SpinnerWrapper caption="Preparing and sending..." />
            </div>
          </div>
        )}

        {showingForm && (
          <div className="itemsContainer hoverable">
            <h4 className="stepTitle">Send invitations</h4>
            <div className="card-panel validationMessage">
              {!profile && <p>YOU NEED TO LOG IN!</p>}

              {profile && !adminAssos && <p>YOU NEED ADMIN RIGHTS!</p>}

              {profile &&
                adminAssos &&
                !this.validateEmailsList(emailsList) && (
                  <p>
                    Please double check your input. The emails should be
                    separated by commas (','). Beware not to forget any @ and
                    dot. No comma at the end of the list.
                  </p>
                )}
              {errorMessage && (
                <strong>
                  <p>{errorMessage}</p>
                </strong>
              )}
            </div>

            {!!profile &&
              !!adminAssos && (
                <div className="container itemDetails">
                  <h5>
                    Please enter the email addresses for which the accounts
                    should be created:
                  </h5>

                  <br />
                  <form onSubmit={this.onSubmit}>
                    <div className="input-field loginEmail">
                      <i className={'material-icons prefix icon-orange'}>
                        email
                      </i>
                      <textarea
                        name="emailsList"
                        value={emailsList}
                        onChange={this.handleChange}
                        style={{
                          marginTop: '2em',
                          marginBottom: '1em',
                          height: '14em'
                        }}
                      />
                      <label
                        htmlFor="emailsList"
                        className="double-line-label active"
                        style={{ width: '100%' }}
                      >
                        One or more email addresses, comma separated.<br />
                        <em>
                          e.g.: john@example.com, jane@example.com,
                          luke@example.com
                        </em>
                      </label>
                    </div>

                    <div className="schoolGrade">
                      <label>
                        Name of the association:
                        {adminAssos.length > 1 ? (
                          <select
                            className={'browser-default'}
                            value={selectedAsso}
                            onChange={this.handleAssoChange}
                          >
                            <option value="grapefruit">Grapefruit</option>
                            {adminAssos &&
                              adminAssos.map(assoId => (
                                <option key={assoId} value={assoId}>
                                  {' '}
                                  {assosById[assoId].name}{' '}
                                </option>
                              ))}
                          </select>
                        ) : (
                          <h6 style={{ color: 'black' }}>
                            {assosById[adminAssos[0]].name}
                          </h6>
                        )}
                      </label>
                    </div>

                    <br />
                    <button
                      className={
                        !this.validateEmailsList(emailsList)
                          ? 'btn-large disabled'
                          : 'waves-effect waves-light btn-large orange lighten-1'
                      }
                      type="submit"
                      name="action"
                    >
                      <i className="material-icons left">send</i>
                      Create
                    </button>
                  </form>
                </div>
              )}
          </div>
        )}

        {showingResult && (
          <div>
            <div className="itemsContainer hoverable">
              <h4 className="stepTitle">Confirmation of invitations</h4>

              <div>
                <h5>
                  {badFormatEmails.length} account(s) not created because emails
                  badly formatted
                </h5>
                <ul>
                  {badFormatEmails.map(email => <li key={email}>{email}</li>)}
                </ul>
              </div>

              <div>
                <h5>
                  {duplicateEmails.length} account(s) not created because
                  already existing
                </h5>
                <ul>
                  {duplicateEmails.map(email => <li key={email}>{email}</li>)}
                </ul>
              </div>

              <div>
                <h5>{newEmails.length} account(s) created </h5>
                <ul>{newEmails.map(email => <li key={email}>{email}</li>)}</ul>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    profile: getProfile(state),
    adminAssos: getAdminAssos(state),
    assosById: getAssosById(state)
  };
}

export default connect(mapStateToProps, actions)(sendInvites);

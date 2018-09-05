import React, { Component } from 'react';
// import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import * as Validation from '../../utils/Validation';
import SpinnerWrapper from '../SpinnerWrapper';
import * as actions from '../../actions';
import { getProfile, getAdminAssos } from '../../selectors';

class sendInvites extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.validateEmailsList = this.validateEmailsList.bind(this);
    this.state = {
      before: true,
      loading: false,
      after: false,
      emailsList: '',
      newMembersAsso: '',
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
    this.setState({ [event.target.name]: event.target.value });
  }

  async onSubmit(event) {
    event.preventDefault();
    this.setState({ before: false, loading: true, after: false });
    // let { emailsList, loading, errorMessage } = this.state;
    let emailsList = this.state.emailsList;
    const emailsArray = emailsList.split(',').map(string => string.trim());

    let result;
    try {
      result = await axios.put('/api/createFamilies', {
        emailsArray,
        newMembersAsso: this.state.newMembersAsso
      });
    } catch (err) {
      console.log('SendInvites.js, ERROR by axios put createFamilies: ', err);
      this.setState({
        before: true,
        loading: false,
        after: false,
        errorMessage:
          'Something went wrong, sorry about this! Please try again. ' + err
      });
      return;
    }

    // TODO handle error of server unauthorized, result is then undefined

    // console.log('result: ', result);

    let {
      newEmails,
      newfamiliesByEmail,
      badFormatEmails,
      duplicateEmails
    } = result.data;

    this.setState({
      before: false,
      loading: false,
      after: true,
      newEmails,
      newfamiliesByEmail,
      badFormatEmails,
      duplicateEmails
    });
  }

  render() {
    const {
      before,
      emailsList,
      loading,
      after,
      newMembersAsso,
      newEmails,
      badFormatEmails,
      duplicateEmails,
      errorMessage
    } = this.state;

    const { adminAssos } = this.props;

    return (
      <div>
        {!this.props.profile && (
          <div className="itemsContainer hoverable">
            <h4 className="stepTitle">Send invitations</h4>
            <h5>Please log in!</h5>
          </div>
        )}

        {loading && (
          <div className="itemsContainer hoverable">
            <h4 className="stepTitle">Send invitations</h4>
            <div className="container itemDetails">
              <SpinnerWrapper caption="Preparing and sending..." />
            </div>
          </div>
        )}

        {this.props.profile &&
          !this.props.adminAssos && (
            <SpinnerWrapper caption="Looking up for which asso you got admin rights..." />
          )}

        {this.props.profile &&
          this.props.adminAssos &&
          before && (
            <div className="itemsContainer hoverable">
              <h4 className="stepTitle">Send invitations for English Link</h4>
              <div className="container itemDetails">
                <h5>
                  Please enter the email addresses to which the invitations
                  should be sent:
                </h5>
                <br />
                <br />
                <form onSubmit={this.onSubmit}>
                  <div className="schoolGrade">
                    <label>Association</label>
                    <select
                      name="newMembersAsso"
                      className="browser-default"
                      value={newMembersAsso}
                      onChange={this.handleChange}
                    >
                      {adminAssos.map(assoId => (
                        <option key={assoId} value={assoId}>
                          {assoId}
                        </option>
                      ))}
                    </select>
                  </div>
                  <br />
                  <br />

                  <div className="input-field loginEmail">
                    <i className={'material-icons prefix icon-orange'}>email</i>
                    <textarea
                      name="emailsList"
                      value={emailsList}
                      onChange={this.handleChange}
                      style={{
                        marginTop: '1em',
                        marginBottom: '1em',
                        height: '14em'
                      }}
                    />
                    <label
                      htmlFor="emailsList"
                      className="double-line-label active"
                    >
                      One or more email addresses, comma separated.<br />
                      <em>
                        e.g.: john@example.com, jane@example.com,
                        luke@example.com
                      </em>
                    </label>
                  </div>

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
                    Send the invitations
                  </button>
                </form>

                <div className="card-panel validationMessage">
                  {!this.validateEmailsList(emailsList) && (
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
              </div>
            </div>
          )}

        {after && (
          <div>
            <div className="itemsContainer hoverable">
              <h4 className="stepTitle">Confirmation of invitations</h4>

              <div>
                <h5>
                  {badFormatEmails.length} account(s) not created because emails
                  badly formatted
                </h5>
                <ul>{badFormatEmails.map(email => <li>{email}</li>)}</ul>
              </div>

              <div>
                <h5>
                  {duplicateEmails.length} account(s) not created because
                  already existing
                </h5>
                <ul>{duplicateEmails.map(email => <li>{email}</li>)}</ul>
              </div>

              <div>
                <h5>{newEmails.length} account(s) created </h5>
                <ul>{newEmails.map(email => <li>{email}</li>)}</ul>
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
    adminAssos: getAdminAssos(state)
  };
}

export default connect(mapStateToProps, actions)(sendInvites);

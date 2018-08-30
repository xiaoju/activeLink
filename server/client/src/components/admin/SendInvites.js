import React, { Component } from 'react';
// import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import * as Validation from '../../utils/Validation';
import SpinnerWrapper from '../SpinnerWrapper';
import * as actions from '../../actions';

class sendInvites extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.validateEmailsList = this.validateEmailsList.bind(this);
    this.state = {
      before: true,
      emailsList: '',
      loading: false,
      after: false,
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
      result = await axios.put('/api/createFamilies', { emailsArray });
      console.log('result: ', result);
    } catch (err) {
      console.log('SendInvites.js, ERROR by axios put createFamilies: ', err);
      this.setState({
        // UIStep: 'before',
        before: true,
        loading: false,
        after: false,
        errorMessage:
          'Something went wrong, sorry about this! Please try again. ' + err
      });
      return;
    }

    // TODO handle error of server unauthorized, result is then undefined
    // TODO the "After" version of the page

    let {
      newEmails,
      newfamiliesByEmail,
      badFormatEmails,
      duplicateEmails
      // apiErrorMessage: errorMessage // TODO check this
    } = result.data;

    this.setState({
      before: false,
      loading: false,
      after: true,
      newEmails,
      newfamiliesByEmail,
      badFormatEmails,
      duplicateEmails
      // errorMessage
    });
  }

  render() {
    const {
      before,
      emailsList,
      loading,
      after,
      newEmails,
      // newfamiliesByEmail,
      badFormatEmails,
      duplicateEmails,
      errorMessage
    } = this.state;
    return (
      <div>
        {loading && (
          <div className="itemsContainer hoverable">
            <h4 className="stepTitle">Send invitations</h4>
            <div className="container itemDetails">
              <SpinnerWrapper caption="Preparing and sending..." />
            </div>
          </div>
        )}

        {before && (
          <div className="itemsContainer hoverable">
            <h4 className="stepTitle">Send invitations</h4>
            <div className="container itemDetails">
              <h5>
                Please enter the email addresses to which the invitations should
                be sent:
              </h5>
              <br />
              <form onSubmit={this.onSubmit}>
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
                      e.g.: john@example.com, jane@example.com, luke@example.com
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
                <h5>{badFormatEmails.length} emails badly formatted</h5>
                <ul>{badFormatEmails.map(email => <li>{email}</li>)}</ul>
              </div>

              <div>
                <h5>{duplicateEmails.length} duplicate emails</h5>
                <ul>{duplicateEmails.map(email => <li>{email}</li>)}</ul>
              </div>

              <div>
                <h5>{newEmails.length} accounts created </h5>
                <ul>{newEmails.map(email => <li>{email}</li>)}</ul>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
// export default sendInvites;
// export default connect()(sendInvites);
// export default withRouter(connect(null, actions)(sendInvites));
export default connect(null, actions)(sendInvites);

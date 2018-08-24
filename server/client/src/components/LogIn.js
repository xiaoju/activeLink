import React, { Component } from 'react';
// import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import * as Validation from '../utils/Validation';
import axios from 'axios';
import SpinnerWrapper from './SpinnerWrapper';
// import * as actions from '../actions';

class LogIn extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.state = {
      loginEmail: '',
      loginPassword: '',
      resendPassword: false,
      loading: false,
      errorMessage: ''
    };
  }

  handleChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    target.type === 'checkbox'
      ? this.setState({
          loginPassword: '',
          [name]: value
        })
      : this.setState({
          [name]: value
        });
  }

  onSubmit(event) {
    event.preventDefault();
    this.setState({ loading: true });
    const { loginEmail, loginPassword, resendPassword } = this.state;

    resendPassword
      ? axios
          // user only provides email address, asking for password reset
          .post('/auth/reset', {
            primaryEmail: loginEmail
          })
          .then(result => {
            const { resetTokenEmailSent, emailedTo } = result.data;
            if (resetTokenEmailSent) {
              this.props.dispatch(push('/EmailSent/' + emailedTo));
            } else {
              // stay on /login page
              this.setState({
                loading: false,
                errorMessage:
                  'The authentication failed, please double check the email address.'
              });
            }
          })
      : axios
          // user provides email and password and wants to log in
          .post('/auth/local', {
            primaryEmail: loginEmail,
            password: loginPassword
          })
          // .then(() => this.props.fetchUser());
          .then(() => this.props.dispatch(push('/register')))
          .catch(error => {
            this.setState({
              loading: false,
              errorMessage:
                'The authentication failed, please double check email address and password. You can also check the box to reset the pasword.'
            });
          });
  }
  //   if (error.response) {
  //     // The request was made and the server responded with a status code
  //     // that falls out of the range of 2xx
  //     console.log('error.response.data:', error.response.data);
  //     console.log('error.response.status:', error.response.status);
  //     console.log('error.response.headers:', error.response.headers);
  //   } else if (error.request) {
  //     // The request was made but no response was received
  //     // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
  //     // http.ClientRequest in node.js
  //     console.log(error.request);
  //   } else {
  //     // Something happened in setting up the request that triggered an Error
  //     console.log('error.message:', error.message);
  //   }
  //   console.log('error.config:', error.config);
  // });
  // if (error.response.status === 401) {
  //   console.log('error.response.status:', error.response.status);
  // }

  render() {
    const {
      loginEmail,
      loginPassword,
      resendPassword,
      loading,
      errorMessage
    } = this.state;
    return (
      <div className="itemsContainer hoverable">
        <h4 className="stepTitle">Members area</h4>

        {loading ? (
          <SpinnerWrapper caption="Loading..." />
        ) : (
          <div className="container itemDetails">
            <h5>Please log in to enter the members area:</h5>
            <br />
            <form onSubmit={this.onSubmit}>
              <div className="input-field loginEmail">
                <i className={'material-icons prefix icon-orange'}>email</i>
                <input
                  // type="email"
                  name="loginEmail"
                  id="loginEmail"
                  value={loginEmail}
                  onChange={this.handleChange}
                />
                <label htmlFor="loginEmail" className="active">
                  Email
                </label>
              </div>

              {!resendPassword ? (
                <div className="input-field loginPassword">
                  <i className={'material-icons prefix icon-orange'}>lock</i>
                  <input
                    type="password"
                    name="loginPassword"
                    id="loginPassword"
                    value={loginPassword}
                    onChange={this.handleChange}
                  />
                  <label htmlFor="loginEmail" className="active">
                    Password
                  </label>
                </div>
              ) : (
                <div className="input-field loginPassword">
                  <br />
                  <br />
                  <br />
                </div>
              )}
              <br />
              <div className="photoConsentCheckbox">
                <input
                  // TODO align left
                  name="resendPassword"
                  type="checkbox"
                  checked={resendPassword}
                  onChange={this.handleChange}
                  id="resendPassword"
                  className="filled-in checkbox-orange z-depth-2"
                />
                <label htmlFor="resendPassword">
                  I don't know my password: send me a reset link per email!
                </label>
              </div>
              <br />

              <button
                className={
                  !Validation.validateEmail(loginEmail) ||
                  (!resendPassword && !loginPassword)
                    ? 'btn-large disabled'
                    : 'waves-effect waves-light btn-large orange lighten-1'
                }
                type="submit"
                name="action"
              >
                <i className="material-icons left">send</i>
                {resendPassword ? "Let's reset my password" : 'Login'}
              </button>

              {/* <div>
              <p>
                Need an account?{' '}
                <Link to="/getinvited">Request an invitation here!</Link>
              </p>
            </div> */}
            </form>

            <div className="card-panel validationMessage">
              {!Validation.validateEmail(loginEmail) && (
                <p>Please fill-in the email field with a valid address.</p>
              )}
              {!resendPassword &&
                !loginPassword && <p>Please type your password.</p>}
              {errorMessage && (
                <p>
                  <strong>{errorMessage}</strong>
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
}
export default connect()(LogIn);
// export default withRouter(connect(null, actions)(LogIn));

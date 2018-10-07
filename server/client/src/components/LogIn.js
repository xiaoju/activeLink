import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as Validation from '../utils/Validation';
import SpinnerWrapper from './SpinnerWrapper';
import * as actions from '../actions';
import * as ActiveLinkAPI from '../utils/ActiveLinkAPI';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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

  componentDidMount() {
    // console.log('Login.js did mount');
    this.handleMessageCode(this.props.match.params.messageCode);
  }

  // componentDidUpdate() {
  // happens after wrong password has been entered, and the app redirects
  // back to same page `/login/some_message` to try again
  // console.log('Login.js did update');
  // this.setState({ loading: false });
  // this.handleMessageCode(this.props.match.params.messageCode);
  // }

  handleChange(event) {
    // console.log('login.js handleChange');
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

  handleMessageCode(messageCode) {
    // console.log('login.js, handleMessageCode');
    switch (messageCode) {
      case 'test': {
        this.setState({ errorMessage: 'TEST MESSAGE' });
        return;
      }

      case 'fetchError': {
        this.setState({
          errorMessage:
            "Sorry, there is a problem with the server ('fetchError'). " +
            'Please try again later, or inform us per email to dev@xiaoju.io \n' +
            'Thank you!'
        });
        return;
      }

      case 'fetchDispatchError': {
        this.setState({
          errorMessage:
            "Sorry, there is a problem with the server ('fetchDispatchError'). " +
            'Please try again later, or inform us per email to dev@xiaoju.io \n' +
            'Thank you!'
        });
        return;
      }

      case 'invalidToken': {
        this.setState({
          errorMessage:
            'The token to reset your password is invalid. Please note that ' +
            'you have 24 hours to reset the password, after reception of ' +
            "the 'reset' email. Please also double-check that there was no " +
            'mistake copying the link from your email.'
        });
        return;
      }

      case 'unchangedPassword': {
        this.setState({
          errorMessage:
            'Sorry, the password was not updated.' +
            'Please try again or ask for support, with an email to dev@xiaoju.io'
        });
        return;
      }

      case 'passwordResetError': {
        this.setState({
          errorMessage:
            'Sorry, there was a mistake with password reset. ' +
            'Please try again or ask for support, with an email to dev@xiaoju.io'
        });
        return;
      }

      case 'no_pwd_match': {
        console.log('handleMessage: no_pwd_match');
        this.setState({
          // loading: false,
          errorMessage: 'Wrong password. Please try again.'
        });
        return;
      }

      case 'no_account_with_email': {
        this.setState({
          errorMessage: 'Wrong login. Please try again.'
        });
        return;
      }

      // case 'pwd_did_match'

      default:
        this.setState({ errorMessage: '' });
        return;
    }
  }

  async onSubmit(event) {
    // console.log('login.js, onSubmit');
    event.preventDefault();
    this.setState({ loading: true });
    const { loginEmail, loginPassword, resendPassword } = this.state;

    if (resendPassword) {
      // user only provides email address, asking for password reset
      ActiveLinkAPI.requestPasswordReset(loginEmail)
        .then(result =>
          this.props.history.push('/EmailSent/' + result.data.emailedTo)
        )
        .catch(error => {
          console.log('JSON.stringify(error) (catch): ', JSON.stringify(error));
          this.setState({
            loading: false,
            errorMessage: error.response.data.message
          });
        });
      // .then(result => {
      //   const { message, resetTokenEmailSent, emailedTo } = result.data;
      //   if (resetTokenEmailSent) {
      //     this.props.history.push('/EmailSent/' + emailedTo);
      //   } else {
      //     // stay on /login page
      //     // console.log(
      //     //   error.response &&
      //     //     error.response.data &&
      //     //     error.response.data.message
      //     // );
      //     this.setState({
      //       loading: false,
      //       errorMessage:
      //         'The authentication failed, please double check that the ' +
      //         'email address you typed is the one you registered with.'
      //     });
      //   }
      // })
      // .catch(error => console.log('error by requestPasswordReset: ', error));
    } else {
      ActiveLinkAPI.localLogin({
        primaryEmail: loginEmail,
        password: loginPassword
      })
        // .then(output => {
        //   console.log(
        //     'output.data.message: ',
        //     output && output.data && output.data.message
        //   );
        // })
        .then(() => ActiveLinkAPI.fetchFamily())
        .then(fetched => this.props.loadFamily(fetched.data))
        .then(() => this.props.history.push('/register'))
        .catch(error => {
          // console.log('JSON.stringify(error): ', JSON.stringify(error));
          this.setState({
            loading: false,
            errorMessage:
              error.response &&
              error.response.data &&
              error.response.data.message
          });
        });
    }
  }

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
                <FontAwesomeIcon
                  style={{ transform: 'translate(-30%, 18%)' }}
                  className="prefix"
                  icon="envelope"
                  color="#ffa726"
                  size="1x"
                />
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
                  <FontAwesomeIcon
                    style={{ transform: 'translate(-30%, 18%)' }}
                    className="prefix"
                    icon="lock"
                    color="#ffa726"
                    size="1x"
                  />
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
                {resendPassword ? (
                  <FontAwesomeIcon
                    style={{ transform: 'translate(-30%, 18%)' }}
                    icon="paper-plane"
                    size="2x"
                  />
                ) : (
                  <FontAwesomeIcon
                    style={{ transform: 'translate(-30%, 18%)' }}
                    icon="sign-in-alt"
                    size="2x"
                  />
                )}

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

export default connect(null, actions)(LogIn);

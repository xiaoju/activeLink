import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as Validation from '../utils/Validation';
import axios from 'axios';
import SpinnerWrapper from './SpinnerWrapper';
import * as actions from '../actions';

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
    this.handleMessageCode(this.props.match.params.messageCode);
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

  handleMessageCode(messageCode) {
    // console.log('messageCode: ', messageCode);
    switch (messageCode) {
      case '851': {
        console.log('case 851');
        this.setState({ errorMessage: 'TEST MESSAGE' });
        return;
      }

      default:
        console.log('case null');
        this.setState({ errorMessage: '' });
    }
  }

  async onSubmit(event) {
    event.preventDefault();
    this.setState({ loading: true });
    const { loginEmail, loginPassword, resendPassword } = this.state;

    if (resendPassword) {
      axios
        // user only provides email address, asking for password reset
        .post('/auth/reset', {
          primaryEmail: loginEmail
        })
        .then(result => {
          const { resetTokenEmailSent, emailedTo } = result.data;
          if (resetTokenEmailSent) {
            this.props.history.push('/EmailSent/' + emailedTo);
          } else {
            // stay on /login page
            this.setState({
              loading: false,
              errorMessage:
                'The authentication failed, please double check that the email address you typed is the one you registered with.'
            });
          }
        });
    } else {
      // user provides email and password and wants to log in
      // first authenticate (axios.post)
      // if this works, fetchUser
      // and then redirect
      //
      // but if authentication failed, don't fetch and don't redirect.

      // TODO refactor without nested 'try await' loops
      try {
        await axios.post('/auth/local', {
          primaryEmail: loginEmail,
          password: loginPassword
        });

        try {
          await this.props.fetchUser();
          // .then(() => this.props.dispatch(push('/register')))
        } catch (err) {
          // error by fetchUser
          console.log('LogIn.js, error by fetchuser: ', err);
        }

        this.props.history.push('/register');
      } catch (err) {
        // error by axios.post
        // console.log('err: ', err);
        // console.log('err.toString(): ', err.toString());
        // console.log(
        //   'Object.getOwnPropertyNames(err): ',
        //   Object.getOwnPropertyNames(err)
        // );
        // Object.getOwnPropertyNames(err).map(key =>
        //   console.log(key, ': ', err[key])
        // );
        // console.log('err.request.status', err.request.status);
        this.setState({
          loading: false,
          errorMessage:
            'The authentication failed. Please double check email address and password. You can also tick the orange checkbox, fill-in your email and press the button to request a new password.'
        });
      }

      // .catch(error => {
      //   this.setState({
      //     loading: false,
      //     errorMessage:
      //       'The authentication failed, please double check email address and password. You can also check the box to reset the pasword.'
      //   });
      // });
    }
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

export default connect(null, actions)(LogIn);

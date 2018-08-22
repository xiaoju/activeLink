import React, { Component } from 'react';
import * as Validation from '../utils/Validation';
import axios from 'axios';

class LogIn extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.state = {
      loginEmail: '',
      loginPassword: '',
      resendPassword: false
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
    const { loginEmail, loginPassword, resendPassword } = this.state;

    resendPassword
      ? axios
          .post('/auth/reset', {
            primaryEmail: loginEmail
          })
          .then(result =>
            console.log('REQUESTED RESET EMAIL. RESULT: ', result)
          )
      : axios
          .post('/auth/local', {
            primaryEmail: loginEmail,
            password: loginPassword
          })
          .then(result => console.log('REQUESTED LOG IN. RESULT:', result));
  }

  render() {
    return (
      <div className="itemsContainer hoverable">
        <h4 className="stepTitle">Log in to enter</h4>
        <div className="container itemDetails">
          <form onSubmit={this.onSubmit}>
            <div className="input-field loginEmail">
              <i className={'material-icons prefix icon-orange'}>email</i>
              <input
                // type="email"
                name="loginEmail"
                id="loginEmail"
                value={this.state.loginEmail}
                onChange={this.handleChange}
              />
              <label htmlFor="loginEmail" className="active">
                Email
              </label>
            </div>

            {!this.state.resendPassword ? (
              <div className="input-field loginPassword">
                <i className={'material-icons prefix icon-orange'}>lock</i>
                <input
                  type="password"
                  name="loginPassword"
                  id="loginPassword"
                  value={this.state.loginPassword}
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
                checked={this.state.resendPassword}
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
                !Validation.validateEmail(this.state.loginEmail) ||
                (!this.state.resendPassword && !this.state.loginPassword)
                  ? 'btn-large disabled'
                  : 'waves-effect waves-light btn-large orange lighten-1'
              }
              type="submit"
              name="action"
            >
              <i className="material-icons left">send</i>
              {this.state.resendPassword ? "Let's reset my password" : 'Login'}
            </button>

            {/* <div>
              <p>
                Need an account?{' '}
                <Link to="/getinvited">Request an invitation here!</Link>
              </p>
            </div> */}
          </form>

          <div className="card-panel validationMessage">
            {!Validation.validateEmail(this.state.loginEmail) && (
              <p>Please type-in a valid email.</p>
            )}
          </div>
        </div>
      </div>
    );
  }
}
export default LogIn;

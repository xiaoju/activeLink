import React, { Component } from 'react';
import SpinnerWrapper from './SpinnerWrapper';
import * as ActiveLinkAPI from '../utils/ActiveLinkAPI';

class ResetPassword extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.state = {
      resetToken: this.props.match.params.resetToken,
      tokenIsValid: null,
      password1: '',
      password2: ''
    };
  }

  handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({ [name]: value });
  }

  onSubmit(event) {
    event.preventDefault();
    const { resetToken, password1 } = this.state;

    ActiveLinkAPI.resetPassword({ resetToken, newPassword: password1 })
      .then(result => {
        const { passwordWasChanged } = result.data;
        if (passwordWasChanged) {
          this.props.history.push('/register');
        } else {
          this.props.history.push('/login/unchangedPassword');
        }
      })
      .catch(error => {
        console.log('ResetPassword.js, 40, error: ', error);
        this.props.history.push('/login/passwordResetError');
      });
  }

  componentDidMount() {
    ActiveLinkAPI.checkResetToken(this.props.match.params.resetToken)
      .then(result => this.setState({ tokenIsValid: result.data.tokenIsValid }))
      .catch(error => {
        console.log('ERROR by checkResetToken(): ', error);
        this.props.history.push('/login/invalidToken');
      });
  }
  // TODO
  // !tokenIsValid && redirect to /login with message that
  // "Password reset token is invalid or has expired, please request a new reset link";
  // also pass the 'resendPassword: false' parameter to /login,

  componentDidUpdate() {
    // !this.state.tokenIsValid && this.props.history.push('/login');
    console.log('ResetPassword.js did update');
  }

  render() {
    const {
      tokenIsValid,
      password1,
      password2
      // , loading
    } = this.state;

    return (
      <div className="itemsContainer hoverable">
        <h4 className="stepTitle">Reset password</h4>
        <br />
        {tokenIsValid === null ? (
          <SpinnerWrapper caption="Processing your request..." />
        ) : (
          <div className="container itemDetails">
            <form onSubmit={this.onSubmit}>
              <div className="input-field loginPassword">
                <i className={'material-icons prefix icon-orange'}>lock</i>
                <input
                  type="password"
                  name="password1"
                  id="password1"
                  value={password1}
                  onChange={this.handleChange}
                />
                <label htmlFor="loginEmail" className="active">
                  New password
                </label>
              </div>

              <div className="input-field loginPassword">
                <i className={'material-icons prefix icon-orange'}>lock</i>
                <input
                  type="password"
                  name="password2"
                  id="password2"
                  value={password2}
                  onChange={this.handleChange}
                />
                <label htmlFor="loginEmail" className="active">
                  Confirm password
                </label>
              </div>
              <br />
              <button
                className={
                  password1 !== password2
                    ? 'btn-large disabled'
                    : 'waves-effect waves-light btn-large orange lighten-1'
                }
                type="submit"
                name="action"
              >
                <i className="material-icons left">send</i>
                Update password
              </button>
            </form>
            <div className="card-panel validationMessage">
              {password1 !== password2 && <p>The two passwords don't match!</p>}
            </div>
          </div>
        )}
      </div>
    );
  }
}
export default ResetPassword;

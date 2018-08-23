import React, { Component } from 'react';
import axios from 'axios';
import { push } from 'connected-react-router';
import SpinnerWrapper from './SpinnerWrapper';
import { connect } from 'react-redux';

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
    axios
      .post('/auth/reset', { resetToken, password1 })
      .then(() => this.props.dispatch(push('/register'))) // TODO  only if was successful!
      .catch(err => console.log('AXIOS error: ', err));
  }

  componentDidMount() {
    try {
      axios
        .get(`/auth/checkResetToken/${this.props.match.params.resetToken}`)
        .then(result =>
          this.setState({ tokenIsValid: result.data.tokenIsValid })
        );
    } catch (error) {
      console.log('ERROR by AXIOS checkResetToken: ', error);
    }
  }
  // this.props.checkResetToken(this.props.match.params.resetToken);
  // .then(output => console.log('output: ', output));
  // .then(tokenIsValid => this.setState({ tokenIsValid }));

  // !tokenIsValid && redirect to /login with message that
  // "Password reset token is invalid or has expired, please request a new reset link";
  // also pass the 'resendPassword: false' parameter to /login,
  // by saving it into the redux store.

  componentDidUpdate() {
    !this.state.tokenIsValid && this.props.dispatch(push('/login'));
  }

  render() {
    const { resetToken, tokenIsValid, password1, password2 } = this.state;

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

// export default ResetPassword;

// function mapStateToProps(state) {
//   return {
//     tokenIsValid: getTokenIsValid(state)
//   };
// }
//
// function mapDispatchToProps(dispatch) {
//   return bindActionCreators({ checkResetToken }, dispatch);
// }
//

// function mapStateToProps(state) {
//   return { store: state.store };
// }
//
export default connect()(ResetPassword);

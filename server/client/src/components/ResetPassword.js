import React, { Component } from 'react';
import { connect } from 'react-redux';
import SpinnerWrapper from './SpinnerWrapper';
import * as ActiveLinkAPI from '../utils/ActiveLinkAPI';
import * as actions from '../actions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PageSection from './layout/PageSection';

class ResetPassword extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.state = {
      resetToken: this.props.match.params.resetToken,
      loadingBefore: true,
      loadingAfter: false,
      password1: '',
      password2: ''
    };
  }

  componentDidMount() {
    ActiveLinkAPI.checkResetToken(this.props.match.params.resetToken)
      .then(result =>
        this.setState({
          loadingBefore: false
        })
      )
      .catch(error => {
        // console.log('ERROR by checkResetToken(): ', JSON.stringify(error));
        if (error.response.status === 401) {
          this.props.history.push('/login/invalidToken');
        } else {
          this.props.history.push('/login/serverError');
        }
      });
  }

  handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({ [name]: value });
  }

  onSubmit(event) {
    event.preventDefault();
    const { resetToken, password1 } = this.state;
    this.setState({ loadingAfter: true });

    ActiveLinkAPI.resetPassword({ resetToken, newPassword: password1 })
      .then(result => {
        const { passwordWasChanged } = result.data;
        if (passwordWasChanged) {
          ActiveLinkAPI.fetchFamily()
            .then(fetched => this.props.loadFamily(fetched.data))
            .then(() => this.props.history.push('/register'))
            .catch(error =>
              console.log(
                'resetPassword.js: fetchFamily() or push(/register) failed: ',
                error
              )
            );
        } else {
          this.props.history.push('/login/unchangedPassword');
        }
      })
      .catch(error => {
        console.log('ResetPassword.js, 40, error: ', error);
        this.props.history.push('/login/passwordResetError');
      });
  }

  render() {
    const { password1, password2, loadingBefore, loadingAfter } = this.state;

    return (
      <PageSection sectionTitle="Reset password">
        {loadingBefore || loadingAfter ? (
          <SpinnerWrapper caption="Processing your request..." />
        ) : (
          <div className="container itemDetails">
            <form onSubmit={this.onSubmit}>
              <div className="input-field loginPassword">
                <FontAwesomeIcon
                  style={{ transform: 'translate(-30%, 18%)' }}
                  className="prefix"
                  icon="lock"
                  color="#ffa726"
                />
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
                <FontAwesomeIcon
                  style={{ transform: 'translate(-30%, 18%)' }}
                  className="prefix"
                  icon="lock"
                  color="#ffa726"
                />
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
                <FontAwesomeIcon
                  style={{ transform: 'translate(-30%, 18%)' }}
                  icon="paper-plane"
                  size="2x"
                />
                Update password
              </button>
            </form>
            <div className="card-panel validationMessage">
              {password1 !== password2 && <p>The two passwords don't match!</p>}
            </div>
          </div>
        )}
      </PageSection>
    );
  }
}

export default connect(null, actions)(ResetPassword);

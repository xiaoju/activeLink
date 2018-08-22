import React, { Component } from 'react';
import axios from 'axios';

class ResetPassword extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.state = {
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
    const { password1 } = this.state;
    axios
      .post('/auth/reset', { password1 })
      .then(result => console.log('RESULT:', result));
  }

  render() {
    return (
      <div className="itemsContainer hoverable">
        <h4 className="stepTitle">Reset password</h4>
        <br />
        <div className="container itemDetails">
          <form onSubmit={this.onSubmit}>
            <div className="input-field loginPassword">
              <i className={'material-icons prefix icon-orange'}>lock</i>
              <input
                type="password"
                name="password1"
                id="password1"
                value={this.state.password1}
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
                value={this.state.password2}
                onChange={this.handleChange}
              />
              <label htmlFor="loginEmail" className="active">
                Confirm password
              </label>
            </div>
            <br />
            <button
              className={
                this.state.password1 !== this.state.password2
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
            {this.state.password1 !== this.state.password2 && (
              <p>The two passwords don't match!</p>
            )}
          </div>
        </div>
      </div>
    );
  }
}
export default ResetPassword;

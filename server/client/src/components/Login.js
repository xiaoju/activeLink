import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Login extends Component {
  render() {
    return (
      <div>
        <h3>MEMBERS AREA</h3>
        <h4>Choose your login method:</h4>
        <Link to="/loginform" className="btn">
          Email + password
        </Link>
        <br />
        <br />
        <Link to="/auth/github" className="btn">
          Github
        </Link>
      </div>
    );
  }
}

export default Login;

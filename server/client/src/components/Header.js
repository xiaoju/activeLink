import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Payments from './Payments';

class Header extends Component {
  renderContent() {
    switch (this.props.auth) {
      case null:
        return;
      case false:
        return [
          <li key="9">
            <a href="/auth/google">Login through Google</a>
          </li>,
          // <li key="8">
          //   <a href="/auth/github">Login with Github</a>
          // </li>,
          <li key="7">
            <a href="/auth/local">Login through username+password</a>
          </li>
        ];
      default:
        return [
          <li key="1">
            <Payments />
          </li>,
          // <li key="2" style={{ margin: '0 10px' }}>
          //   Credits: {this.props.auth.credits}
          // </li>,
          <li key="5">
            <a href="/api/profile">
              <i className="medium material-icons">account_box</i>
            </a>
          </li>
          // <li key="3">
          //   <a href="/api/logout">Logout</a>
          // </li>
        ];
    }
  }

  render() {
    return (
      <div className="navbar-fixed">
        <nav>
          <div className="nav-wrapper deep-purple lighten-2">
            <Link
              to={this.props.auth ? '/dashboard' : '/'}
              className="left brand-logo"
            >
              English Link
            </Link>
            <ul className="right">{this.renderContent()}</ul>
          </div>
        </nav>
      </div>
    );
  }
}

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(mapStateToProps)(Header);

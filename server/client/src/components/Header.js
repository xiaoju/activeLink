import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import englishLinkLogo from '../pictures/englishLinkLogo.png';

class Header extends Component {
  renderContent() {
    switch (this.props.auth) {
      case null:
        return;
      case false:
        // case null:
        // case false:
        return [
          <li key="9">
            <a href="/auth/google">Login with Google</a>
          </li>,
          // <li key="8">
          //   <a href="/auth/github">Login with Github</a>
          // </li>,
          <li key="7">
            <a href="/auth/local">Login with username+password</a>
          </li>
        ];
      default:
        return [
          // <li key="1">
          //   <Payments />
          // </li>,
          // <li key="2" style={{ margin: '0 10px' }}>
          //   Credits: {this.props.auth.credits}
          // </li>,
          // <li key="5">
          //   <a href="/api/profile">
          //     <i className="medium material-icons">account_box</i>
          //   </a>
          // </li>,
          // <li key="3">
          //   <a href="/api/logout">Logout</a>
          // </li>
          // <li key="3">
          //   <a href="/api/logout" className="medium material-icons">
          //     power_settings_new
          //   </a>
          // </li>,
          <li key="6" className="hoverable">
            <a href="/api/logout">
              <i className="medium material-icons">exit_to_app</i>
            </a>
          </li>
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
              <img src={englishLinkLogo} alt="logo" />
            </Link>
            <span className="center brand-logo">{this.props.eventName}</span>
            <ul className="right">{this.renderContent()}</ul>
          </div>
        </nav>
      </div>
    );
  }
}

function mapStateToProps({ auth, data }) {
  return {
    auth,
    eventName: data.eventName
  };
}

export default connect(mapStateToProps)(Header);

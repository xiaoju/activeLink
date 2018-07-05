import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getProfile, getEvent } from '../selectors';
import englishLinkLogo from '../pictures/englishLinkLogo.png';

class Header extends Component {
  renderContent() {
    switch (this.props.profile) {
      case null:
      // return;
      // falls through
      case false:
        return [
          <li key="1">
            <a href="/auth/google">Login with Google</a>
          </li>
          // <li key="2">
          //   <a href="/auth/local">Login with username+password</a>
          // </li>
        ];
      default:
        return [
          <li key="3" className="hoverable">
            <a href="/api/logout">
              <i className="medium material-icons">exit_to_app</i>
            </a>
          </li>
        ];
    }
  }

  render() {
    const { profile, event } = this.props;
    return (
      <div className="navbar-fixed">
        <nav>
          <div className="nav-wrapper deep-purple lighten-2">
            <Link to="/" className="left brand-logo">
              <img src={englishLinkLogo} alt="logo" className="hoverable" />
            </Link>
            <span className="center brand-logo">
              {!event ? 'English Link' : event.eventName}
            </span>
            <ul className="right">{this.renderContent()}</ul>
          </div>
        </nav>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    event: getEvent(state),
    profile: getProfile(state)
  };
}

export default connect(mapStateToProps)(Header);

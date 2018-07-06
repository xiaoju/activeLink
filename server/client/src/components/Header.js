import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getProfile, getEvent } from '../selectors';
import englishLinkLogo from '../pictures/englishLinkLogo.png';

class Header extends Component {
  render() {
    const { event, profile } = this.props;
    return (
      <div className="navbar-fixed">
        <nav>
          <div id="logo" className="nav-wrapper deep-purple lighten-2">
            <Link to="/" className="left brand-logo">
              <img src={englishLinkLogo} className="hoverable" />
            </Link>

            <a href="#" class="brand-logo center">
              {!event ? 'English Link' : event.eventName}
            </a>

            <ul id="nav-mobile" className="right hide-on-med-and-down">
              <li>
                {!profile ? (
                  <a href="/auth/google">Login with Google</a>
                ) : (
                  <a href="/api/logout">
                    <i className="medium material-icons">exit_to_app</i>
                  </a>
                )}
              </li>
            </ul>
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

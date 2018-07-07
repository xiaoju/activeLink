import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getProfile } from '../selectors';
import englishLinkLogo from '../pictures/englishLinkLogo.png';

class Header extends Component {
  render() {
    const { profile } = this.props;
    return (
      <div className="navbar-fixed">
        <nav>
          <div id="logo" className="nav-wrapper deep-purple lighten-2">
            <Link to="/" className="left brand-logo">
              <img src={englishLinkLogo} className="hoverable" alt="logo" />
            </Link>

            <a href="/" className="brand-logo center">
              English Link
              {/* {!event ? 'English Link' : event.eventName} */}
            </a>

            <ul id="nav-mobile" className="right">
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
    profile: getProfile(state)
  };
}

export default connect(mapStateToProps)(Header);

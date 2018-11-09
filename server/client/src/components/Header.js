import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getProfile } from '../selectors';
import englishLinkLogo from '../pictures/englishLinkLogo.png';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
            </a>

            <ul id="nav-mobile" className="right">
              <li>
                {!profile ? (
                  <Link title="Sign in" to="/login">
                    <FontAwesomeIcon
                      icon="sign-in-alt"
                      color="fff"
                      size="4x"
                      style={{ verticalAlign: 'middle' }}
                    />
                  </Link>
                ) : (
                  <a title="Sign out" href="/api/v1/logout">
                    <FontAwesomeIcon
                      icon="sign-out-alt"
                      color="fff"
                      size="4x"
                      style={{ verticalAlign: 'middle' }}
                    />
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

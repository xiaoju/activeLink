import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getProfile } from '../selectors';
import NotLogged from './NotLogged';
import NextEvents from './NextEvents';
import LinkToCall from './LinkToCall';
import MyProfile from './MyProfile';
import MyClasses from './MyClasses';

class Home extends Component {
  render() {
    const { profile } = this.props;

    return !!profile ? (
      <div>
        <NextEvents />
        <LinkToCall />
        <MyProfile />
        <MyClasses />
      </div>
    ) : (
      <NotLogged />
    );
  }
}

function mapStateToProps(state) {
  return {
    profile: getProfile(state)
  };
}

export default connect(mapStateToProps)(Home);

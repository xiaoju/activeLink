import React, { Component } from 'react';
import { Route } from 'react-router';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as actions from '../actions';
import Header from './Header';
import RegistrationPage from './RegistrationPage';
import Thanks from './Thanks';

class App extends Component {
  componentDidMount() {
    this.props.fetchUser();
  }

  render() {
    return (
      <div>
        <Header />
        <Route path="/register" component={RegistrationPage} />
        <Route path="/thanks" component={Thanks} />
      </div>
    );
  }
}

export default withRouter(connect(null, actions)(App));

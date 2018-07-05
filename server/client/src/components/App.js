import React, { Component } from 'react';
import { Route } from 'react-router';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as actions from '../actions';
import Header from './Header';
import Home from './Home';
import RegisterEvent from './RegisterEvent';
import Thanks from './Thanks';

class App extends Component {
  componentDidMount() {
    this.props.fetchUser();
  }

  render() {
    return (
      <div>
        <Header />
        <Route exact path="/" component={Home} />
        {/* <Route path="/register/:eventId" component={RegisterEvent} /> */}
        <Route path="/register" component={RegisterEvent} />
        <Route path="/thanks" component={Thanks} />
      </div>
    );
  }
}

export default withRouter(connect(null, actions)(App));

import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../actions';

import Header from './Header';
import Events from './Events';
import Login from './Login';
import LoginForm from './LoginForm';
import Test from './Test';
// const Dashboard = () => <h2>Dashboard</h2>;
// const CreateItem = () => <h2>CreateItem</h2>;

class App extends Component {
  componentDidMount() {
    this.props.fetchUser();
  }

  render() {
    return (
      <div className="container">
        <BrowserRouter>
          <div>
            <Header />
            {/* <Test /> */}
            <Route path="/" component={Events} />
            <Route path="/login" component={Login} />
            <Route path="/loginform" component={LoginForm} />
            {/* <Route path="/createItem" component={CreateItem} />
            <Route path="/dashboard" component={Dashboard} /> */}
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default connect(null, actions)(App);

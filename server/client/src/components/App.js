import React, { Component } from 'react';
import { Route } from 'react-router';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as actions from '../actions';
import Header from './Header';
import Home from './Home';
import RegisterEvent from './RegisterEvent';
import LogIn from './LogIn';
import GetInvited from './GetInvited';
import Thanks from './Thanks';
import Sorry from './Sorry';
import ResetPassword from './ResetPassword';

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
        <Route path="/login" component={LogIn} />
        <Route path="/getinvited" component={GetInvited} />
        <Route path="/thanks" component={Thanks} />
        <Route path="/sorry" component={Sorry} />
        <Route path="/reset" component={ResetPassword} />
      </div>
    );
  }
}

export default withRouter(connect(null, actions)(App));

import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../actions';
import Header from './Header';
import Home from './Home';
import RegisterEvent from './RegisterEvent';
import LogIn from './LogIn';
import GetInvited from './GetInvited';
import Thanks from './Thanks';
import Sorry from './Sorry';
import ResetPassword from './ResetPassword';
import PageNotFound from './PageNotFound';
import EmailSent from './EmailSent';
import SendInvites from './admin/SendInvites';
import Dump from './admin/Dump';
import Dashboard from './admin/Dashboard';
import UpdateOthers from './admin/UpdateOthers';
import UpdateMany from './admin/UpdateMany';

import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faSignInAlt,
  faSignOutAlt,
  faMoneyCheck,
  faCreditCard,
  faExchangeAlt,
  faShoppingCart
} from '@fortawesome/free-solid-svg-icons';
library.add(
  faSignInAlt,
  faSignOutAlt,
  faMoneyCheck,
  faCreditCard,
  faExchangeAlt,
  faShoppingCart
);

class App extends Component {
  componentDidMount() {
    // console.log('app.js did mount');
    this.props.fetchUser();
  }

  // componentDidUpdate() {
  //   // console.log('app.js did update');
  //   this.props.fetchUser();
  // }

  render() {
    return (
      <div>
        <Header />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/register/:eventId?" component={RegisterEvent} />
          <Route path="/login/:messageCode?" component={LogIn} />
          <Route path="/getinvited" component={GetInvited} />
          <Route path="/thanks" component={Thanks} />
          <Route path="/sorry" component={Sorry} />
          <Route path="/emailsent/:emailedTo" component={EmailSent} />
          <Route path="/reset/:resetToken" component={ResetPassword} />
          <Route path="/admin/sendinvites" component={SendInvites} />
          <Route path="/admin/dump" component={Dump} />
          <Route path="/admin/dashboard" component={Dashboard} />
          {/* <Route path="/admin/updateothers" component={UpdateOthers} /> */}
          <Route path="/admin/updatemany" component={UpdateMany} />
          <Route component={PageNotFound} />
        </Switch>
      </div>
    );
  }
}

export default withRouter(connect(null, actions)(App));

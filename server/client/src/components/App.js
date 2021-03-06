import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../actions';
import * as ActiveLinkAPI from '../utils/ActiveLinkAPI';
import '../utils/fontAwesome';
import ErrorBoundary from './layout/ErrorBoundary';
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
// import UpdateOthers from './admin/UpdateOthers';
// import UpdateMany from './admin/UpdateMany';

class App extends Component {
  componentDidMount() {
    ActiveLinkAPI.fetchFamily()
      .then(fetched => this.props.loadFamily(fetched.data))
      .catch(error => console.log('app.js: fetchFamily() failed.'));
  }

  render() {
    return (
      <div>
        <ErrorBoundary>
          <Header />
        </ErrorBoundary>
        <ErrorBoundary>
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
            {/* <Route path="/admin/updatemany" component={UpdateMany} /> */}
            <Route component={PageNotFound} />
          </Switch>
        </ErrorBoundary>
      </div>
    );
  }
}

export default withRouter(connect(null, actions)(App));

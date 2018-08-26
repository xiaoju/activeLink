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
import SendInvites from './SendInvites';

class App extends Component {
  componentDidMount() {
    this.props.fetchUser();
  }

  componentDidUpdate() {
    this.props.fetchUser();
  }

  render() {
    return (
      <div>
        <Header />
        <Switch>
          <Route exact path="/" component={Home} />
          {/* <Route path="/register/:eventId" component={RegisterEvent} /> */}
          <Route path="/register" component={RegisterEvent} />
          <Route path="/login" component={LogIn} />
          <Route path="/getinvited" component={GetInvited} />
          <Route path="/thanks" component={Thanks} />
          <Route path="/sorry" component={Sorry} />
          <Route path="/emailsent/:emailedTo" component={EmailSent} />
          <Route path="/reset/:resetToken" component={ResetPassword} />
          <Route path="/sendinvites" component={SendInvites} />
          <Route component={PageNotFound} />
        </Switch>
      </div>
    );
  }
}

export default withRouter(connect(null, actions)(App));

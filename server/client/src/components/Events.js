import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';

class Events extends Component {
  render() {
    return (
      <div style={{ textAlign: 'center' }}>
        {/* <button className="btn">Show past events</button> */}
        <p>Credits: {this.props.auth && this.props.auth.credits}</p>
        <p>
          First Event:{' '}
          {this.props.events && this.props.events.events.abc01.title}
          {!this.props.auth && 'please log in to show the events'}
        </p>
      </div>
    );
  }
}

function mapStateToProps({ auth, events }) {
  return { auth, events };
}

export default connect(mapStateToProps, actions)(Events);

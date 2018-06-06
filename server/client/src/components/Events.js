import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';

class Events extends Component {
  render() {
    return (
      <div style={{ textAlign: 'center' }}>
        {/* <button className="btn">Show past events</button> */}
        {/* <p>Credits: {this.props.auth && this.props.auth.credits}</p> */}
        <p>
          {/* First Event: <br /> */}
          <h5>{this.props.data && this.props.data.data.events.e01.name}</h5>
          <br />
          {this.props.data && this.props.data.data.items.r1.name}
          <br />
          {this.props.data && this.props.data.data.items.r2.name}
          <br />
          {this.props.data && this.props.data.data.items.r3.name}
          {!this.props.auth && 'please log in to show the events'}
        </p>
      </div>
    );
  }
}

function mapStateToProps({ auth, data }) {
  return { auth, data };
}

export default connect(mapStateToProps, actions)(Events);

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getEvent, getProfile } from '../selectors';

class Home extends Component {
  render() {
    const { event, profile } = this.props;

    return (
      <div>
        {!profile ? (
          <h5>
            <strong>Please log in to see the members area.</strong>
          </h5>
        ) : !!event ? (
          <div className="itemsContainer hoverable">
            <div className="innerContainer">
              <h4 className="stepTitle">Members Area</h4>
              <div className="title_and_button">
                <strong>
                  <h5>Event open for registration:</h5>
                </strong>
                <Link to={`/register`}>{event.eventName}</Link>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div>
              <h4>Members area</h4>
              <h5>The next event isn't opened to booking yet.</h5>
            </div>
          </div>
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    event: getEvent(state),
    profile: getProfile(state)
  };
}

export default connect(mapStateToProps)(Home);

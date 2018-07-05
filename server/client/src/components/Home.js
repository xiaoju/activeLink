import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getEvent, getProfile } from '../selectors';
import SpinnerWrapper from './SpinnerWrapper';

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
          <div>
            <h4>Members</h4>
            <br />
            <h5>Event open for registration:</h5>
            <Link to={`/register`}>{event.eventName}</Link>
          </div>
        ) : (
          <div>
            <div>
              <h4>Members area</h4>
              <h5>The next event isn't opened to booking yet.</h5>
            </div>
          </div>
        )}

        {/* <ul>
          {allEvents.map(eventId => (
            <li>
              <Link to={`/register/${eventId}`}>
                {eventsById[eventId].name}
              </Link>
            </li>
          ))}
        </ul> */}
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

Home.propTypes = {
  allEvents: PropTypes.array.isRequired
};

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  getEvent,
  getAvailableForRegistrationEvents,
  getEventsById
} from '../selectors';

class NextEvents extends Component {
  render() {
    const { event } = this.props;
    const { availableForRegistrationEvents, eventsById } = this.props;

    return (
      <div className="itemsContainer hoverable">
        <div className="innerContainer">
          <h4 className="stepTitle">Next Events</h4>
          <div className="title_and_button">
            <strong>
              {/* 1- this you registered already, and it's coming soon!
              2a- The next event isn't opened for booking yet.
              or
              2b- this is now open for registration */}
              <h5>
                {availableForRegistrationEvents.length === 0
                  ? "The next event isn't opened for booking yet."
                  : availableForRegistrationEvents.map(eventId => (
                      <Link to={`/register`}>
                        "{eventsById[eventId].eventName}" is now open for
                        registration!
                        {/* "{event.eventName}" is now open for registration! */}
                      </Link>
                    ))}
              </h5>
            </strong>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    event: getEvent(state),
    availableForRegistrationEvents: getAvailableForRegistrationEvents(state),
    eventsById: getEventsById(state)
  };
}

export default connect(mapStateToProps)(NextEvents);

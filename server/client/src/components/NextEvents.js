import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getAvailableForRegistrationEvents, getEventsById } from '../selectors';

class NextEvents extends Component {
  render() {
    const { availableForRegistrationEvents, eventsById } = this.props;

    return (
      <div className="itemsContainer hoverable">
        <div className="innerContainer">
          <h4 className="stepTitle">Next Events</h4>
          <div className="title_and_button">
            <strong>
              <h5>
                {availableForRegistrationEvents.length === 0
                  ? "The next event isn't opened for booking yet."
                  : availableForRegistrationEvents.map(eventId => (
                      <Link key={eventId} to={`/register/${eventId}`}>
                        "{eventsById[eventId].eventName}" is now open for
                        registration!
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
    availableForRegistrationEvents: getAvailableForRegistrationEvents(state),
    eventsById: getEventsById(state)
  };
}

export default connect(mapStateToProps)(NextEvents);

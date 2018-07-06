import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getEvent } from '../selectors';

class NextEvents extends Component {
  render() {
    const { event } = this.props;

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
                {!event ? (
                  "The next event isn't opened for booking yet."
                ) : (
                  <Link to={`/register`}>
                    "{event.eventName}" is now open for registration!
                  </Link>
                )}
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
    event: getEvent(state)
  };
}

export default connect(mapStateToProps)(NextEvents);

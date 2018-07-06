import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getEvent, getProfile } from '../selectors';

class Home extends Component {
  render() {
    const { event, profile } = this.props;

    return (
      <div className="itemsContainer hoverable">
        <div className="innerContainer">
          <h4 className="stepTitle">Members Area</h4>
          <div className="title_and_button">
            <strong>
              <h5>
                {!profile ? (
                  'Please log in to enter the members area.'
                ) : !event ? (
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
    event: getEvent(state),
    profile: getProfile(state)
  };
}

export default connect(mapStateToProps)(Home);

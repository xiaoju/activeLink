import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';

class Events extends Component {
  render() {
    return (
      <div style={{ textAlign: 'center' }}>
        {/* <p>Credits: {this.props.auth && this.props.auth.credits}</p> */}
        {!this.props.auth && 'please log in to show the events'}
        <h5>{this.props.data && this.props.data.data.events.e01.name}</h5>
        <br />
        {this.props.data &&
          Object.keys(this.props.data.data.items).map((thisItem, i) => (
            <div className="" key={i}>
              <h5>{this.props.data.data.items[thisItem].name}</h5>

              <div>{this.props.data.data.items[thisItem].description}</div>

              {this.props.data.data.items[thisItem].teacherName && (
                <div>
                  Animated by {this.props.data.data.items[thisItem].teacherName}
                </div>
              )}

              {this.props.data.data.items[thisItem].priceFamily && (
                <div>
                  Price per family:{' '}
                  {this.props.data.data.items[thisItem].priceFamily} EUR/year
                </div>
              )}

              {this.props.data.data.items[thisItem].priceFirstKid &&
                !this.props.data.data.items[thisItem].priceSecondKid && (
                  <div>
                    Price per kid:{' '}
                    {this.props.data.data.items[thisItem].priceFirstKid}{' '}
                    EUR/year
                  </div>
                )}

              {this.props.data.data.items[thisItem].priceFirstKid &&
                this.props.data.data.items[thisItem].priceSecondKid && (
                  <div>
                    <div>
                      Price 1st kid:{' '}
                      {this.props.data.data.items[thisItem].priceFirstKid}{' '}
                      EUR/year
                    </div>

                    <div>
                      Discounted price:{' '}
                      {this.props.data.data.items[thisItem].priceSecondKid}{' '}
                      EUR/year
                    </div>
                  </div>
                )}

              {this.props.data &&
                Object.keys(this.props.data.data.kids).map((thisKid, i) => (
                  <div className="kids" key={i}>
                    <span>checkbox </span>
                    <span>{this.props.data.data.kids[thisKid].firstName}</span>
                    <span> xxx EUR</span>
                  </div>
                ))}
            </div>
          ))}
      </div>
    );
  }
}

function mapStateToProps({ auth, data }) {
  return { auth, data };
}

export default connect(mapStateToProps, actions)(Events);

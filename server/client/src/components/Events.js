import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import { bindActionCreators } from 'redux';
import { exportSelection } from '../actions/index';
// import PropTypes from 'prop-types';

class Events extends Component {
  constructor(props) {
    super(props);
    this.state = {
      total: 30,
      kid1: {
        r1: false,
        r2: false,
        r3: false,
        r4: false,
        r5: false,
        r6: false,
        r7: false
      },
      kid2: {
        r1: false,
        r2: false,
        r3: false,
        r4: false,
        r5: false,
        r6: false,
        r7: false
      }
      // Object.keys(this.props.data.data.kids).map((thisKid)=>([thisKid]: [false, false, false, false, false, false, false],)
      // this would be an array, still to convert to object...
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle(event) {
    this.setState({
      // [event.target.name]: event.target.value
      [event.target.name]: !this.state.mulanr1
    });
  }

  render() {
    return (
      <div style={{ textAlign: 'center' }}>
        {/* <p>Credits: {this.props.auth && this.props.auth.credits}</p> */}
        {!this.props.auth && <h5>Please log in to show the events.</h5>}
        {this.props.data && (
          <div className="card deep-purple lighten-2">
            <div className="card-content">
              <span className="card-title">
                <strong>{this.props.data.data.events.e01.name}</strong>
              </span>

              <ol style={{ textAlign: 'left' }}>
                {this.props.data.data.events.e01.instructions.map(
                  thisTextRow => (
                    <li>
                      <p>{thisTextRow}</p>
                    </li>
                  )
                )}
              </ol>
            </div>
          </div>
        )}

        <div class="divider" />
        {this.props.data &&
          Object.keys(this.props.data.data.items).map((thisItem, i) => (
            <div>
              <div className="" key={i}>
                <h5>
                  <strong>{this.props.data.data.items[thisItem].name}</strong>
                </h5>
                <div>{this.props.data.data.items[thisItem].description}</div>
                {this.props.data.data.items[thisItem].teacherName && (
                  <div>
                    Animated by{' '}
                    {this.props.data.data.items[thisItem].teacherName}
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

                {this.props.data.data.items[thisItem].priceFamily &&
                  Object.keys(this.props.data.data.allParents).map(
                    (thisParent, i) => (
                      <div key={i}>
                        <div>
                          <input
                            type="checkbox"
                            onChange={this.toggle}
                            id={
                              this.props.data.data.allParents[thisParent]
                                .familyName +
                              this.props.data.data.items[thisItem].id
                            }
                            className="filled-in checkbox-orange"
                            checked="checked"
                          />
                          <label
                            for={
                              this.props.data.data.allParents[thisParent]
                                .familyName +
                              this.props.data.data.items[thisItem].id
                            }
                          >
                            {
                              this.props.data.data.allParents[thisParent]
                                .familyName
                            }
                          </label>
                        </div>
                        <span> xxx EUR</span>
                      </div>
                    )
                  )}

                {this.props.data &&
                  !this.props.data.data.items[thisItem].priceFamily &&
                  Object.keys(this.props.data.data.allKids).map(
                    (thisKid, i) => (
                      <div className="kids" key={i}>
                        <div>
                          <input
                            type="checkbox"
                            onChange={this.toggle}
                            id={
                              this.props.data.data.allKids[thisKid].firstName +
                              this.props.data.data.items[thisItem].id
                            }
                            className="filled-in checkbox-orange"
                            // checked="checked"
                          />
                          <label
                            for={
                              this.props.data.data.allKids[thisKid].firstName +
                              this.props.data.data.items[thisItem].id
                            }
                          >
                            {this.props.data.data.allKids[thisKid].firstName}
                          </label>
                        </div>

                        <span> xxx EUR</span>
                      </div>
                    )
                  )}
              </div>
              <div class="divider" />
            </div>
          ))}
        <br />
      </div>
    );
  }
}

function mapStateToProps({ auth, data, selection }) {
  return { auth, data, selection };
}

// function mapDispatchToProps(dispatch) {
//   return bindActionCreators(
//     {
//       exportSelection: exportSelection
//     },
//     dispatch
//   );
// }

export default connect(
  mapStateToProps
  // , mapDispatchToProps
)(Events);

// Events.propTypes = {
//   postId: PropTypes.string.isRequired,
//   newComment: PropTypes.func.isRequired,
//   comments: PropTypes.object.isRequired,
// }

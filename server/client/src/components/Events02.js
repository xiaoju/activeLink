import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import { bindActionCreators } from 'redux';
import { exportSelection } from '../actions/index';
// import PropTypes from 'prop-types';

class Events02 extends Component {
  constructor(props) {
    super(props);
    this.state = {};
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
                <strong>{this.props.data.event.name}</strong>
              </span>

              <ol style={{ textAlign: 'left' }}>
                {this.props.data.event.instructions.map(thisTextRow => (
                  <li>
                    <p>{thisTextRow}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}
        <div class="divider" />
        {this.props.data &&
          this.props.data.event.items.map((thisItemId, i) => (
            // console.log('TEST',thisItem,this.props.data.data.items[thisItem])
            <div>
              {/* Name of the class */}
              <h5>
                <strong>{this.props.data.items[thisItemId].name}</strong>
              </h5>

              {/* Description of the class */}
              <div>{this.props.data.items[thisItemId].description}</div>

              {/* Teacher name */}
              {this.props.data.items[thisItemId].teacherName && (
                <div>
                  Animated by {this.props.data.items[thisItemId].teacherName}
                </div>
              )}

              {/* when price is per family, not per kid */}
              {this.props.data.items[thisItemId].priceFamily && (
                <div>
                  Price per family:{' '}
                  {this.props.data.items[thisItemId].priceFamily / 100} EUR/year
                </div>
              )}

              {/* when there is only one price per kid, no discount for further ones */}
              {this.props.data.items[thisItemId].priceFirstKid &&
                !this.props.data.items[thisItemId].priceSecondKid && (
                  <div>
                    Price per kid:{' '}
                    {this.props.data.items[thisItemId].priceFirstKid / 100}{' '}
                    EUR/year
                  </div>
                )}

              {/* when there is a discount for next kids */}
              {this.props.data.items[thisItemId].priceFirstKid &&
                this.props.data.items[thisItemId].priceSecondKid && (
                  <div>
                    <div>
                      Price 1st kid:{' '}
                      {this.props.data.items[thisItemId].priceFirstKid / 100}{' '}
                      EUR/year
                    </div>

                    <div>
                      Discounted price:{' '}
                      {this.props.data.items[thisItemId].priceSecondKid / 100}{' '}
                      EUR/year
                    </div>
                  </div>
                )}

              {/* the checkboxes. */}
              <div>
                {Object.keys(this.props.data.users)
                  .filter(thisUserId =>
                    this.props.data.users[thisUserId].items.includes(thisItemId)
                  )
                  .map(thisUserId => (
                    <div>
                      <input
                        type="checkbox"
                        onChange={this.toggle}
                        id={thisItemId + '_' + thisUserId}
                        className="filled-in checkbox-orange"
                        // checked="checked"
                      />
                      <label for={thisItemId + '_' + thisUserId}>
                        {this.props.data.users[thisUserId].label}
                      </label>
                    </div>
                  ))}
              </div>

              <div class="divider" />
            </div>
          ))}
        {/* {this.props.data.data.items[thisItem].priceFamily &&
                  Object.keys(this.props.data.data.parents).map(
                    (thisParent, i) => (
                      <div key={i}>
                        <div>
                          <input
                            type="checkbox"
                            onChange={this.toggle}
                            id={
                              this.props.data.data.parents[thisParent]
                                .familyName +
                              this.props.data.data.items[thisItem].id
                            }
                            className="filled-in checkbox-orange"
                            checked="checked"
                          />
                          <label
                            for={
                              this.props.data.data.parents[thisParent]
                                .familyName +
                              this.props.data.data.items[thisItem].id
                            }
                          >
                            {
                              this.props.data.data.parents[thisParent]
                                .familyName
                            }
                          </label>
                        </div>
                        <span> xxx EUR</span>
                      </div>
                    )
                  )} */}
        {/* {this.props.data &&
                  !this.props.data.data.items[thisItem].priceFamily &&
                  Object.keys(this.props.data.data.kids).map((thisKid, i) => (
                    <div className="kids" key={i}>
                      <div>
                        <input
                          type="checkbox"
                          onChange={this.toggle}
                          id={
                            this.props.data.data.kids[thisKid].firstName +
                            this.props.data.data.items[thisItem].id
                          }
                          className="filled-in checkbox-orange"
                        />
                        <label
                          for={
                            this.props.data.data.kids[thisKid].firstName +
                            this.props.data.data.items[thisItem].id
                          }
                        >
                          {this.props.data.data.kids[thisKid].firstName}
                        </label>
                      </div>

                      <span> xxx EUR</span>
                    </div>
                  ))} */}
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
)(Events02);

// Events.propTypes = {
//   postId: PropTypes.string.isRequired,
//   newComment: PropTypes.func.isRequired,
//   comments: PropTypes.object.isRequired,
// }

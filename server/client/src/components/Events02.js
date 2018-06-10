import React, { Component } from 'react';
import { connect } from 'react-redux';
// import * as actions from '../actions';
import { bindActionCreators } from 'redux';
import {
  // toggleCheckbox,
  uncheckCheckbox,
  checkCheckbox
} from '../actions/index';
// import PropTypes from 'prop-types';

class Events02 extends Component {
  // constructor(props) {
  //   super(props);
  //   // this.state = {};
  //   this.toggleCheckbox = this.toggleCheckbox.bind(this);
  // }

  // toggle(itemId, userId, event) {
  //   this.setState({
  //     // [event.target.name]: event.target.value
  //     // [event.target.name]: !this.state.mulanr1
  //     this.state.data.users[userID].checked.filter((thisBox)=>(itemId!==thisBox))
  //   });
  // }

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
                {this.props.data.event.instructions.map(
                  (thisTextRow, index) => (
                    <li key={index}>
                      <p>{thisTextRow}</p>
                    </li>
                  )
                )}
              </ol>
            </div>
          </div>
        )}
        <div className="divider" />
        {this.props.data &&
          this.props.data.event.items.map((thisItemId, i) => (
            // console.log('TEST',thisItem,this.props.data.data.items[thisItem])
            <div key={thisItemId}>
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

              {/* the checkboxes. NB checkboxes state is managed within Redux store */}
              <div>
                {Object.keys(this.props.data.users)
                  .filter(thisUserId =>
                    this.props.data.users[thisUserId].items.includes(thisItemId)
                  )
                  .map(thisUserId => (
                    <div key={thisItemId + '_' + thisUserId}>
                      <input
                        type="checkbox"
                        // onChange={toggleCheckbox({
                        //   thisUserId,
                        //   thisItemId
                        // })}
                        // onChange={thisEvent =>
                        //   this.props.toggleCheckbox(
                        //     { thisUserId, thisItemId },
                        //     thisEvent
                        //   )
                        // }
                        onChange={thisEvent =>
                          // test
                          this.props.checked[thisUserId].includes(thisItemId)
                            ? // if already in array
                              this.props.uncheckCheckbox(
                                thisUserId,
                                thisItemId,
                                thisEvent
                              )
                            : // if not yet in array
                              this.props.checkCheckbox(
                                thisUserId,
                                thisItemId,
                                thisEvent
                              )
                        }
                        // onChange={thisEvent =>
                        //   console.log(thisUserId, thisItemId)
                        // }
                        id={thisItemId + '_' + thisUserId}
                        className="filled-in checkbox-orange"
                        // checked={this.props.data.users[thisUserId].checked.includes(thisItemId) && 'checked'}

                        // using the checkbox data from draftState.js
                        // checked={
                        //   this.props.data.checked[thisUserId].includes(
                        //     thisItemId
                        //   ) && 'checked'
                        // }

                        // using the checkbox data from checkedReducer
                        checked={
                          this.props.checked[thisUserId].includes(thisItemId) &&
                          'checked'
                        }
                      />
                      <label htmlFor={thisItemId + '_' + thisUserId}>
                        {this.props.data.users[thisUserId].label}
                      </label>
                    </div>
                  ))}
              </div>

              <div className="divider" />
            </div>
          ))}
        <br />
      </div>
    );
  }
}

function mapStateToProps({ auth, data, checked }) {
  return {
    auth,
    data,
    checked
    // , selection
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      // toggleCheckbox: toggleCheckbox,
      checkCheckbox: checkCheckbox,
      uncheckCheckbox: uncheckCheckbox
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Events02);

// Events.propTypes = {
//   postId: PropTypes.string.isRequired,
//   newComment: PropTypes.func.isRequired,
//   comments: PropTypes.object.isRequired,
// }

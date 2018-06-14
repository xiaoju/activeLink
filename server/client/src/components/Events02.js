import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { uncheckCheckbox, checkCheckbox } from '../actions/index';
// import PropTypes from 'prop-types';
import Payments from './Payments';
import {
  // total,
  applyDiscount
} from '../selectors';

class Events02 extends Component {
  render() {
    return (
      <div style={{ textAlign: 'center' }}>
        {/* <p>Credits: {this.props.auth && this.props.auth.credits}</p> */}
        {!this.props.auth && (
          <h5>
            <strong>Please log in to show the members area.</strong>
          </h5>
        )}

        {this.props.auth &&
          this.props.data && (
            <div style={{ textAlign: 'center' }}>
              {/* show the general instructions for this event */}
              <div className="card deep-purple lighten-2">
                <div className="card-content">
                  <span className="card-title">
                    <strong>{this.props.data.event.name}</strong>
                  </span>

                  {/* <ol style={{ textAlign: 'left' }}>
                  {this.props.data.event.instructions.map(
                    (thisTextRow, index) => (
                      <li key={index}>
                        <p>{thisTextRow}</p>
                      </li>
                    )
                  )}
                </ol> */}
                </div>
              </div>

              {/* Step 1: show profile edit short form - ①②③④⑤⑥⑦⑧⑨⑩ */}
              <div className="itemsContainer">
                <h4 className="stepTitle">① Update your profile</h4>
                <h5>
                  <strong>Parents</strong>
                </h5>
                <span />
                <ul>
                  <li>mother (select mother/father/legal representative)</li>
                  <li>First name</li>
                  <li>Family name</li>
                  <li>Adress</li>
                  <li>Email</li>
                  <li>
                    Mobile phone (select mobile, landline, pro mobile, pro
                    landline, perso mobile, person landline, custom)
                  </li>
                </ul>

                <h5>
                  <strong>Kids</strong>
                </h5>
                <ul>
                  <li>First name</li>
                  <li>Family name</li>
                  <li>
                    School grade (2018-2019) (select PS, MS, GS, CP, CE1, CE2,
                    CM1, CM2)
                  </li>
                </ul>

                <button
                  className="btn waves-effect waves-light orange lighten-1 z-depth-2"
                  type="submit"
                  name="action"
                >
                  save
                  <i className="material-icons right">send</i>
                </button>
              </div>

              {/* step2: list the items of this event */}
              <div className="itemsContainer">
                <h4 className="stepTitle">② Select classes for your kids</h4>
                {this.props.data &&
                  this.props.data.event.items.map((thisItemId, i) => (
                    // console.log('TEST',thisItem,this.props.data.data.items[thisItem])

                    <div key={thisItemId} className="container itemDetails">
                      {/* Name of the class */}
                      <h5>
                        <strong>
                          {this.props.data.items[thisItemId].name}
                        </strong>
                      </h5>
                      {/* Description of the class */}
                      <div>{this.props.data.items[thisItemId].description}</div>
                      {/* Teacher name */}
                      {this.props.data.items[thisItemId].teacherName && (
                        <div>
                          Animated by{' '}
                          {this.props.data.items[thisItemId].teacherName}
                        </div>
                      )}

                      {this.props.data.familyItems.includes(thisItemId) ? (
                        <div>
                          Price (per year, per family):{' '}
                          {this.props.data.standardPrices[thisItemId] / 100}{' '}
                          &euro;
                        </div>
                      ) : this.props.data.standardPrices[thisItemId] ===
                      this.props.data.discountedPrices[thisItemId] ? (
                        <div>
                          Price (per year, per kid):{' '}
                          {this.props.data.standardPrices[thisItemId] / 100}{' '}
                          &euro;
                        </div>
                      ) : (
                        <div>
                          <div>
                            Standard price (per year, per kid):{' '}
                            {this.props.data.standardPrices[thisItemId] / 100}{' '}
                            &euro;
                          </div>
                          <div>
                            Discounted price (per year, per kid):{' '}
                            {this.props.data.discountedPrices[thisItemId] / 100}{' '}
                            &euro;
                          </div>
                        </div>
                      )}

                      {/* the checkboxes. NB checkboxes state is managed within Redux store */}
                      <div>
                        {Object.keys(this.props.data.users)
                          .filter(thisUserId =>
                            this.props.data.users[thisUserId].items.includes(
                              thisItemId
                            )
                          )
                          .map(thisUserId => (
                            <div
                              className="usernameCheckbox"
                              key={thisItemId + '_' + thisUserId}
                            >
                              <input
                                type="checkbox"
                                onChange={thisEvent =>
                                  this.props.checked[thisUserId].includes(
                                    thisItemId
                                  )
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
                                id={thisItemId + '_' + thisUserId}
                                className="filled-in checkbox-orange z-depth-2"
                                // TODO "z-depth-2" for shadow effect is not working!
                                // using the checkbox data from checkedReducer
                                checked={
                                  this.props.checked[thisUserId].includes(
                                    thisItemId
                                  ) && 'checked'
                                }
                              />
                              {console.log(
                                'this.props.applyDiscount: [why is this undefined??!] ',
                                this.props.applyDiscount
                              )}
                              <label htmlFor={thisItemId + '_' + thisUserId}>
                                {this.props.data.users[thisUserId].label}
                              </label>
                              <p>
                                {this.props.checked[thisUserId].includes(
                                  thisItemId
                                ) &&
                                  (this.props.applyDiscount
                                    ? this.props.data.discountedPrices[
                                        thisItemId
                                      ] / 100
                                    : this.props.data.standardPrices[
                                        thisItemId
                                      ] / 100)}
                              </p>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
              </div>

              {/* Step 3: review your order  */}
              <div className="itemsContainer">
                <h4 className="stepTitle">③ Review your order</h4>
                <p>xxx fixed width font, white background color xxx</p>
              </div>

              {/* Step 4: pay  */}
              <div className="itemsContainer">
                <h4 className="stepTitle">④ Confirm and pay</h4>
                <Payments />
                <p>
                  Payments are securely processed by 'Stripe'. The connection to
                  the servers is encrypted. English Link doesn't see credit card
                  numbers neither passwords.
                </p>
                <p>
                  'Any questions? You can contact Catherine Souchard per phone:
                  06 32 54 91 62 or email: contactsecretary@englishlink.fr
                </p>
              </div>
            </div>
          )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    // total: total(state),
    applyDiscount: applyDiscount(state),
    auth: state.auth,
    data: state.data,
    checked: state.checked
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
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

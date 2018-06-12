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
import Payments from './Payments';

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
        {!this.props.auth && (
          <h5>
            <strong>Please log in to show the events.</strong>
          </h5>
        )}

        {/* show the general instructions for this event */}
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
              Mobile phone (select mobile, landline, pro mobile, pro landline,
              perso mobile, person landline, custom)
            </li>
          </ul>

          <h5>
            <strong>Kids</strong>
          </h5>
          <ul>
            <li>First name</li>
            <li>Family name</li>
            <li>
              School grade (2018-2019) (select PS, MS, GS, CP, CE1, CE2, CM1,
              CM2)
            </li>
          </ul>

          <button
            class="btn waves-effect waves-light orange lighten-1 z-depth-2"
            type="submit"
            name="action"
          >
            save
            <i class="material-icons right">send</i>
          </button>
        </div>

        {/* step2: list the items of this event*/}
        <div className="itemsContainer">
          <h4 className="stepTitle">② Select classes for your kids</h4>
          {this.props.data &&
            this.props.data.event.items.map((thisItemId, i) => (
              // console.log('TEST',thisItem,this.props.data.data.items[thisItem])

              <div key={thisItemId} className="container itemDetails">
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
                    {this.props.data.items[thisItemId].priceFamily / 100}{' '}
                    EUR/year
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
                        <label htmlFor={thisItemId + '_' + thisUserId}>
                          {this.props.data.users[thisUserId].label}
                        </label>
                      </div>
                    ))}
                </div>
              </div>
            ))}
        </div>

        {/* Step 3: payment  */}
        <div className="itemsContainer">
          <h4 className="stepTitle">③ Confirm and pay</h4>
          <Payments />
          <p>
            Payments are securely processed by 'Stripe'. The connection to the
            servers is encrypted. English Link doesn't see credit card numbers
            neither passwords.
          </p>
          <p>
            'Any questions? You can contact Catherine Souchard per phone: 06 32
            54 91 62 or email: contactsecretary@englishlink.fr
          </p>
        </div>
      </div>
    );
  }
}

function mapStateToProps({ auth, data, checked }) {
  return {
    auth,
    data,
    checked
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

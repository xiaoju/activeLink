import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SpinnerWrapper from '../SpinnerWrapper';
import { fetchDashboard } from '../../actions/index';
import { getProfile, getAdminAssos, getAssosById } from '../../selectors';

class Dashboard extends Component {
  componentDidMount() {
    this.props.fetchDashboard();
  }

  render() {
    const { profile, adminAssos, assosById, errorMessage } = this.props;
    const {
      dashboard: {
        usersById,
        familiesById,
        loaded,
        // kidsByGrade,
        // registrationItems,
        classItems,
        volunteeringItems,
        registrationsByItem,
        FamiliesRegistered,
        FamiliesNotRegistered,
        NoPhotoconsentKids,
        // kidsByFamily,
        // parentsByFamily,
        itemsById,
        kidsQuantity,
        // parentsQuantity,
        volunteers,
        familiesRegisteredQuantity,
        familiesNotRegisteredQuantity
      }
    } = this.props;

    return (
      <div className="itemsContainer hoverable">
        <h4 className="stepTitle">Dashboard</h4>
        {!!profile &&
          !!adminAssos &&
          !loaded && (
            <div>
              <SpinnerWrapper caption="Loading..." />
            </div>
          )}

        {!loaded && (
          <div className="card-panel validationMessage">
            {!profile && <p>YOU NEED TO LOG IN!</p>}

            {profile && !adminAssos && <p>YOU NEED ADMIN RIGHTS!</p>}

            {errorMessage && (
              <strong>
                <p>{errorMessage}</p>
              </strong>
            )}
          </div>
        )}

        {loaded && (
          <div>
            <h5>
              <strong>
                {familiesRegisteredQuantity} families not yet registered:
              </strong>
            </h5>
            {FamiliesNotRegistered.map(
              familyId => familiesById[familyId].primaryEmail
            ).join(', ')}

            <h5>
              <strong>
                {familiesNotRegisteredQuantity} families registered (={' '}
                {kidsQuantity} children):
              </strong>
            </h5>
            {FamiliesRegistered.map(
              familyId => familiesById[familyId].primaryEmail
            ).join(', ')}

            <h5>
              <strong>Registrations by classes</strong>
            </h5>
            {classItems.map(itemId => (
              <div>
                <h5>{itemsById[itemId].name}</h5>
                <div>
                  {registrationsByItem[itemId].map(userId => (
                    <div>
                      <span key={userId}>
                        {usersById[userId].firstName +
                          ' ' +
                          usersById[userId].familyName +
                          ', ' +
                          usersById[userId].kidGrade}
                      </span>
                      <br />
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <h5>
              <strong>Children with "photo consent = no"</strong>
            </h5>
            {NoPhotoconsentKids.map(kidId => (
              <div>
                <span key={kidId}>
                  {usersById[kidId].firstName +
                    ' ' +
                    usersById[kidId].familyName +
                    ', ' +
                    usersById[kidId].kidGrade}
                </span>
                <br />
              </div>
            ))}

            <h5>
              <strong>The Volunteers (by name)</strong>
            </h5>
            {volunteers.map(volunteerObject => (
              <p key={volunteerObject.familyId}>
                <strong>
                  {familiesById[volunteerObject.familyId].allParents
                    .map(
                      parentId =>
                        usersById[parentId].firstName +
                        ' ' +
                        usersById[parentId].familyName
                    )
                    .join(' / ')}
                </strong>
                <br />
                {volunteerObject.volunteeringItemIds.map(itemId => (
                  <div>
                    {itemsById[itemId].name}
                    <br />
                  </div>
                ))}
              </p>
            ))}

            <h5>
              <strong>The Volunteers (by activity)</strong>
            </h5>
            {volunteeringItems.map(itemId => (
              <p key={itemId}>
                <strong>{itemsById[itemId].name}</strong>
                <div>
                  {registrationsByItem[itemId].map(familyId => (
                    <div>
                      <span key={familyId}>
                        {familiesById[familyId].allParents
                          .map(
                            parentId =>
                              usersById[parentId].firstName +
                              ' ' +
                              usersById[parentId].familyName
                          )
                          .join(' / ') +
                          ' ( ' +
                          familiesById[familyId].primaryEmail +
                          ' )'}
                      </span>
                      <br />
                    </div>
                  ))}
                </div>
              </p>
            ))}
          </div>
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    dashboard: state.dashboard,
    profile: getProfile(state),
    adminAssos: getAdminAssos(state),
    assosById: getAssosById(state)
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchDashboard }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);

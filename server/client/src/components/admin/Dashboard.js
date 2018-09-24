import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SpinnerWrapper from '../SpinnerWrapper';
import { fetchDashboard } from '../../actions/index';
import {
  getProfile,
  getAdminAssos
  // , getAssosById
} from '../../selectors';

class Dashboard extends Component {
  componentDidMount() {
    this.props.fetchDashboard();
  }

  render() {
    // define the sort order for the classes
    let ordering = {},
      sortOrder = [
        'PS',
        'MS',
        'GS',
        'CP',
        'CE1',
        'CE2',
        'CM1',
        'CM2',
        '6e',
        '5e',
        '4e',
        '3e'
      ];
    for (var i = 0; i < sortOrder.length; i++) ordering[sortOrder[i]] = i;
    // finished defining the sort order

    const {
      profile,
      adminAssos,
      // assosById,
      errorMessage
    } = this.props;
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
        kidsInClasses,
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
            <div className="container itemDetails">
              <h5>
                <strong>
                  {familiesRegisteredQuantity} families not yet registered:
                </strong>
              </h5>
              {FamiliesNotRegistered.map(
                familyId => familiesById[familyId].primaryEmail
              ).join(', ')}
            </div>
            <div className="container itemDetails">
              <h5>
                <strong>
                  {familiesNotRegisteredQuantity} families registered (={' '}
                  {kidsQuantity} children):
                </strong>
              </h5>
              {FamiliesRegistered.map(
                familyId => familiesById[familyId].primaryEmail
              ).join(', ')}
            </div>
            <div className="container itemDetails page-break-before">
              <h5>
                {kidsInClasses.length} children registered in classes or
                activities:
              </h5>
              <div className="column-count-3">
                {[]
                  .concat(kidsInClasses)
                  .sort(function(a, b) {
                    return (
                      ordering[usersById[a].kidGrade] -
                        ordering[usersById[b].kidGrade] ||
                      usersById[a].familyName.localeCompare(
                        usersById[b].familyName
                      ) ||
                      usersById[a].firstName.localeCompare(
                        usersById[b].firstName
                      )
                    );
                  })
                  .map(kidId => (
                    <div>
                      <span key={kidId}>
                        {usersById[kidId].firstName +
                          ' ' +
                          usersById[kidId].familyName.toUpperCase() +
                          ', ' +
                          usersById[kidId].kidGrade}
                      </span>
                      <br />
                    </div>
                  ))}
              </div>
            </div>

            <div className="container itemDetails">
              <h5>
                {NoPhotoconsentKids.length} children with "photo consent = no"
              </h5>
              <div className="column-count-3">
                {[]
                  .concat(NoPhotoconsentKids)
                  .sort(function(a, b) {
                    return (
                      ordering[usersById[a].kidGrade] -
                        ordering[usersById[b].kidGrade] ||
                      usersById[a].familyName.localeCompare(
                        usersById[b].familyName
                      )
                    );
                  })
                  .map(kidId => (
                    <div>
                      <span key={kidId}>
                        {usersById[kidId].firstName +
                          ' ' +
                          usersById[kidId].familyName.toUpperCase() +
                          ', ' +
                          usersById[kidId].kidGrade}
                      </span>
                      <br />
                    </div>
                  ))}
              </div>
            </div>

            <div className="container itemDetails page-break-before">
              <h5>
                <strong>Registrations by classes</strong>
              </h5>
              {classItems.map(itemId => (
                <div className="no_break_inside">
                  <h5>
                    {itemsById[itemId].name} ({
                      registrationsByItem[itemId].length
                    }{' '}
                    children)
                  </h5>
                  <div className="column-count-3">
                    {[]
                      .concat(registrationsByItem[itemId])
                      .sort(function(a, b) {
                        return (
                          ordering[usersById[a].kidGrade] -
                            ordering[usersById[b].kidGrade] ||
                          usersById[a].familyName.localeCompare(
                            usersById[b].familyName
                          )
                        );
                      })
                      .map(userId => (
                        <div>
                          <span key={userId}>
                            {usersById[userId].firstName +
                              ' ' +
                              usersById[userId].familyName.toUpperCase() +
                              ', ' +
                              usersById[userId].kidGrade}
                          </span>
                          <br />
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="container itemDetails page-break-before">
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
                          usersById[parentId].familyName.toUpperCase()
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
            </div>
            <div className="container itemDetails">
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
                                usersById[parentId].familyName.toUpperCase()
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
    adminAssos: getAdminAssos(state)
    // assosById: getAssosById(state)
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchDashboard }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);

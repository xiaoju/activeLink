import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SpinnerWrapper from '../SpinnerWrapper';
import { loadDashboard } from '../../actions/index';
import { getProfile, getAdminAssos } from '../../selectors';

class Dashboard extends Component {
  componentDidMount() {
    this.props.loadDashboard();
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

    const { profile, adminAssos, errorMessage } = this.props;
    const {
      dashboard: {
        usersById,
        familiesById,
        loaded,
        classItems,
        volunteeringItems,
        registrationsByItem,
        FamiliesRegistered,
        FamiliesNotRegistered,
        NoPhotoconsentKids,
        FamilyIdbyKidId,
        // FamilyIdbyParentId,
        itemsById,
        kidsQuantity,
        kidsInClasses,
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
                  {familiesNotRegisteredQuantity} families not yet registered:
                </strong>
              </h5>
              {FamiliesNotRegistered.map(
                familyId => familiesById[familyId].primaryEmail
              ).join(', ')}
            </div>
            <div className="container itemDetails">
              <h5>
                <strong>
                  {familiesRegisteredQuantity} families registered (={' '}
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
                    <div key={kidId}>
                      <span>
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
                    <div key={kidId}>
                      <span>
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
                <div key={itemId} className="no_break_inside">
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
                        <div key={userId}>
                          <span>
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
                <div key={volunteerObject.familyId}>
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
                    <div key={itemId}>
                      {itemsById[itemId].name}
                      <br />
                    </div>
                  ))}
                  <br />
                </div>
              ))}
            </div>
            <div className="container itemDetails">
              <h5>
                <strong>The Volunteers (by activity)</strong>
              </h5>
              {volunteeringItems.map(itemId => (
                <div key={itemId}>
                  <strong>{itemsById[itemId].name}</strong>
                  <div>
                    {registrationsByItem[itemId].map(familyId => (
                      <div key={familyId}>
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
                  <br />
                </div>
              ))}
            </div>

            <div className="container itemDetails page-break-before">
              {classItems.map(itemId => (
                <div key={itemId} className="no_break_inside page-break-before">
                  <h5>{itemsById[itemId].name}</h5>
                  <h6>
                    <strong>Parents phone numbers</strong>
                  </h6>
                  <div>
                    {[]
                      .concat(registrationsByItem[itemId])
                      .sort(function(a, b) {
                        return usersById[a].familyName.localeCompare(
                          usersById[b].familyName
                        );
                      })
                      .map(userId => (
                        <div key={userId} style={{ display: 'flex' }}>
                          <span style={{ flex: '1' }}>
                            {usersById[userId].firstName +
                              ' ' +
                              usersById[userId].familyName.toUpperCase()}
                          </span>
                          <span style={{ flex: '2' }}>
                            {familiesById[
                              FamilyIdbyKidId[userId].familyId
                            ].familyMedia
                              .filter(
                                mediaObject => mediaObject.media === 'phone'
                              )
                              .map(
                                mediaObject =>
                                  mediaObject.value +
                                  (mediaObject.tags.filter(
                                    thisTag => thisTag !== 'personal'
                                  ).length === 0
                                    ? ''
                                    : ' (' +
                                      mediaObject.tags
                                        .filter(
                                          thisTag => thisTag !== 'personal'
                                        )
                                        .join(', ') +
                                      ')')
                              )
                              .join(', ')}
                          </span>
                          <br />
                        </div>
                      ))}
                  </div>
                </div>
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
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ loadDashboard }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchDashboard } from '../../actions/index';
import {
  getProfile,
  getAdminAssos,
  getErrorMessage,
  getDashboardIsLoaded
} from '../../selectors';
import SpinnerWrapper from '../SpinnerWrapper';
import UpdateOthers from './UpdateOthers';

class RegisterForOther extends Component {
  componentDidMount() {
    this.props.fetchDashboard();
  }

  render() {
    const {
      dashboardIsLoaded,
      profile,
      adminAssos,
      assosById,
      errorMessage
    } = this.props;

    return (
      <div>
        {!dashboardIsLoaded && (
          <div>
            <div>
              {!!profile &&
                !!adminAssos && <SpinnerWrapper caption="Loading..." />}
            </div>

            <div className="card-panel validationMessage">
              {!profile && <p>PLEASE LOG IN!</p>}

              {profile &&
                !adminAssos && <p>YOU NEED ADMINISTRATOR CREDENTIALS!</p>}

              {errorMessage && (
                <strong>
                  <p>{errorMessage}</p>
                </strong>
              )}
            </div>
          </div>
        )}

        {dashboardIsLoaded &&
          !!profile &&
          !!adminAssos && (
            <div>
              <SelectFamily sectionTitle="🄌 Registration for other" />
            </div>
          )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    dashboardIsLoaded: getDashboardIsLoaded(state),
    profile: getProfile(state),
    adminAssos: getAdminAssos(state),
    errorMessage: getErrorMessage(state)
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchDashboard }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(RegisterForOther);

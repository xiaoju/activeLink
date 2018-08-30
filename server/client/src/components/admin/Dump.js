import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SpinnerWrapper from '../SpinnerWrapper';
import { getRegistrations, getDump } from '../../selectors';
import { fetchDump } from '../../actions/index';

class Dump extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      after: false
    };
  }

  componentDidMount() {
    this.props.fetchDump();
  }

  render() {
    const { dump, registrations } = this.props;
    return !dump ? (
      <div className="itemsContainer hoverable">
        <h4 className="stepTitle">DB Dump</h4>
        <div className="container itemDetails">
          <SpinnerWrapper caption="Loading..." />
        </div>
      </div>
    ) : (
      <div className="itemsContainer hoverable">
        <h4 className="stepTitle">DB Dump</h4>
        <h5>Registrations</h5>
        <span>{JSON.stringify(dump.assos[0].registrations, null, 4)}</span>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    dump: getDump(state)
    // registrations: getRegistrations(state)
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchDump }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Dump);

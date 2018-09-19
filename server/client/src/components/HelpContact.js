import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getAssoEmail } from '../selectors';

class HelpContact extends Component {
  render() {
    const { assoEmail } = this.props;

    return (
      <div className="categoryIcon container">
        <div className="myIconContainer">
          <i className="small material-icons prefix">help_outline</i>
        </div>
        <div className="myContactsContainer">
          <p>
            Any questions? Please drop us an email at{' '}
            <strong>{assoEmail}</strong>
          </p>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    assoEmail: getAssoEmail(state)
  };
}

export default connect(mapStateToProps)(HelpContact);

HelpContact.propTypes = {
  assoEmail: PropTypes.string.isRequired
};

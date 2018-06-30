import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import {
  getAllParents,
  getAllKids,
  getFamilyMedia
  // getAllParentsValid
} from '../selectors';
import { addKidRow, addParentRow, addMediaRow } from '../actions/index';
import OneKidForm from './OneKidForm';
import OneMediaForm from './OneMediaForm';

class ProfileForm extends Component {
  constructor(props) {
    super(props);
    this.handleKidClick = this.handleKidClick.bind(this);
    this.handleParentClick = this.handleParentClick.bind(this);
    this.handleMediaClick = this.handleMediaClick.bind(this);
  }

  handleKidClick() {
    this.props.addKidRow();
  }

  handleParentClick() {
    this.props.addParentRow();
  }

  handleMediaClick() {
    this.props.addMediaRow();
  }

  render() {
    const { allParents, allKids, familyMedia } = this.props;

    return (
      <div className="itemsContainer hoverable">
        <div className="innerContainer">
          <h4 className="stepTitle">① Update your profile</h4>
          <div className="title_and_button">
            <h5>
              <strong>Kids</strong>
            </h5>
            <button
              className="btn-floating btn-small waves-effect waves-light orange lighten-1"
              onClick={this.handleKidClick}
            >
              <i className="material-icons" name="kid">
                add
              </i>
            </button>
          </div>

          {allKids.map(userId => <OneKidForm key={userId} userId={userId} />)}
          <div className="title_and_button">
            <h5>
              <strong>Parents</strong>
            </h5>
            <button
              onClick={this.handleParentClick}
              className="btn-floating btn-small waves-effect waves-light orange lighten-1"
              name="parent"
            >
              <i className="material-icons">add</i>
            </button>
          </div>
          {allParents.map(userId => (
            <OneKidForm key={userId} userId={userId} />
          ))}
          <div className="title_and_button">
            <h5>
              <i className="material-icons small">phone</i> &nbsp; &nbsp;
              <i className="material-icons small">email</i>
            </h5>
            <button
              className="btn-floating btn-small waves-effect waves-light orange lighten-1"
              onClick={this.handleMediaClick}
              name="media"
            >
              <i className="material-icons">add</i>
            </button>
          </div>
          {familyMedia.map((mediaObject, index) => (
            <OneMediaForm key={index} index={index} />
          ))}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    allParents: getAllParents(state),
    allKids: getAllKids(state),
    // allParentsValid: getAllParentsValid(state),
    familyMedia: getFamilyMedia(state)
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ addKidRow, addParentRow, addMediaRow }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileForm);

ProfileForm.propTypes = {
  allParents: PropTypes.array.isRequired,
  allKids: PropTypes.array.isRequired,
  familyMedia: PropTypes.array.isRequired
  // allParentsValid: PropTypes.bool.isRequired
};

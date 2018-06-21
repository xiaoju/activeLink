import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { getMediaObject } from '../selectors';
import { modifyMedia } from '../actions/index';

class MediaForm extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  media = !!this.props.mediaObject.email ? 'email' : 'phone';

  handleChange(event) {
    this.props.modifyMedia({
      index: this.props.index,
      media: this.media,
      value: event.target.value
    });
  }

  render() {
    const { mediaObject, index } = this.props;

    return (
      <form className="formInputsContainer OnePhoneContainer">
        <div className="input-field twoNamesContainer">
          <i className="material-icons prefix">{this.media}</i>
          <input
            id={this.media + index}
            name={this.media}
            className="validate"
            value={mediaObject[this.media]}
            onChange={this.handleChange}
          />
        </div>

        <div className="columnContainer schoolGrade">
          {mediaObject.tags.map(tag => (
            <div key={tag} className="chip">
              {tag}
              <i className="close material-icons">close</i>
            </div>
          ))}
        </div>
      </form>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    mediaObject: getMediaObject(state, props)
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ modifyMedia }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MediaForm);

MediaForm.propTypes = {
  mediaObject: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired
};

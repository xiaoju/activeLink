import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { getMediaObject } from '../selectors';
import { modifyMedia } from '../actions/index';

class OneMediaForm extends Component {
  constructor(props) {
    super(props);
    this.handleMediaChange = this.handleMediaChange.bind(this);
  }

  handleMediaChange(event) {
    this.props.modifyMedia({
      index: this.props.index,
      value: event.target.value.toLowerCase()
    });
  }

  render() {
    const { index, mediaObject: { media, value, tags } } = this.props;

    return (
      <form className="formInputsContainer">
        <div className="input-field twoNamesContainer">
          <i
            className={
              'material-icons prefix ' +
              (media === 'more_horiz' ? 'icon-orange' : '')
            }
          >
            {media}
          </i>
          <input
            id={media + index}
            name={media}
            className="validate"
            value={value}
            onChange={this.handleMediaChange}
          />
        </div>

        <div className="columnContainer schoolGrade">
          {tags.map(tag => (
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

export default connect(mapStateToProps, mapDispatchToProps)(OneMediaForm);

OneMediaForm.propTypes = {
  mediaObject: PropTypes.object.isRequired,
  media: PropTypes.string,
  value: PropTypes.string,
  tags: PropTypes.array,
  index: PropTypes.number.isRequired
};

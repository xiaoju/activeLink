import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import CreatableSelect from 'react-select/lib/Creatable';
import * as Animated from 'react-select/lib/animated';
import { updateTags } from '../actions/index';
import PropTypes from 'prop-types';

class SelectComponentStyled extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(onChangeEvent) {
    this.props.updateTags({
      targetArray: this.props.targetArray,
      index: this.props.index,
      tags: onChangeEvent.map(object => object.value)
    });
  }

  render() {
    const { options, tags, isDisabled } = this.props;

    // source code of react-select useful for styling:
    // https://github.com/JedWatson/react-select/blob/v2/src/styles.js

    const colourStyles = {
      control: styles => ({
        // this is the biggest box
        ...styles,
        backgroundColor: 'transparent',
        border: 0,
        boxShadow: null,
        '&:hover': {
          borderColor: '#9575cd'
        }
      }),
      menuList: (styles, { data }) => {
        // this is the popup with the list of options
        return {
          ...styles,
          backgroundColor: '#d1c4e9',
          border: '3px solid #d1c4e9',
          boxShadow:
            '0 4px 5px 0 rgba(0,0,0,0.14), 0 1px 10px 0 rgba(0,0,0,0.12), 0 2px 4px -1px rgba(0,0,0,0.3)'
          // boxShadow as per materializecss "z-depth-2"
        };
      },
      input: (styles, { isFocused, isSelected }) => {
        // this is the empty chip where you type your own tags
        return {
          ...styles,
          visibility: isDisabled && 'hidden',
          minWidth: '3em',
          color: 'rgba(0, 0, 0, 0.6)',
          borderWidth: 'thin',
          borderStyle: 'solid',
          borderColor: isSelected ? '#9575cd' : '#ffa726',
          borderRadius: '15px',
          // padding: '0em',
          margin: '0 0.5em',
          paddingBottom: '15px !important',
          textAlign: 'center !important',
          height: '1.8em'
        };
      },
      valueContainer: styles => {
        return {
          ...styles,
          padding: 0
        };
      },
      indicatorSeparator: styles => {
        return {
          // ...styles,
          // backgroundColor: '#d1c4e9'
          display: 'none'
        };
      },
      option: (
        // these are the dropdown items
        styles,
        { data, isDisabled, isFocused, isSelected, isFullscreen }
      ) => {
        return {
          ...styles,
          backgroundColor: isDisabled
            ? null
            : isSelected ? '#cc3300' : isFocused ? '#9575cd' : '#d1c4e9',
          color: isDisabled
            ? '#ccc'
            : isSelected ? '#f50057 ' : isFocused ? 'white' : 'rgba(0,0,0,0.6)',
          cursor: isDisabled ? 'not-allowed' : 'default',
          fontWeight: 500,
          fontSize: '14px',
          borderBottom: 'thin solid #9575cd'
          // #d1c4e9: purple (tags background color)
          // #ffa726: orange
          // #cc3300: dark red,
          // #9575cd, dark purple
          // #ede7f6: light purple
          // #ccc: light grey
          // #f50057: bright pink (for tests!)
          // #2684ff: standard blue
        };
      },
      dropdownIndicator: () => ({
        display: 'none'
      }),
      // dropdownIndicator: (
      //   styles,
      //   { data, isFocused, isDisabled, isSelected }
      // ) => {
      //   return {
      //     ...styles,
      //     borderRadius: '50%',
      //     color: isDisabled
      //       ? null
      //       : isSelected ? 'white' : isFocused ? 'white' : '#9575cd',
      //     backgroundColor: isDisabled
      //       ? null
      //       : isSelected ? '#9575cd' : isFocused ? '#9575cd' : 'transparent',
      //     ':hover': {
      //       color: 'white',
      //       backgroundColor: '#9575cd'
      //     }
      //   };
      // },
      multiValue: (styles, { data }) => {
        return {
          ...styles,
          backgroundColor: '#d1c4e9',
          // border: 'thick red solid',
          borderRadius: '16px'
        };
      },
      multiValueLabel: (styles, { data }) => ({
        ...styles,
        color: 'rgba(0, 0, 0, 0.6)',
        fontWeight: 500,
        fontSize: '14px',
        backgroundColor: '#d1c4e9',
        borderRadius: '16px 0 0 16px'
      }),
      multiValueRemove: (styles, { data }) => ({
        ...styles,
        color: isDisabled ? 'transparent' : 'rgba(0, 0, 0, 0.6)', // remove the 'delete tag cross' if control is disabled
        backgroundColor: '#d1c4e9',
        borderRadius: '0 16px 16px 0',
        ':hover': {
          backgroundColor: '#9575cd',
          color: 'white'
        }
      })
    };

    return (
      <CreatableSelect
        placeholder=""
        className="SelectComponent"
        classNamePrefix="SelectComponent"
        closeMenuOnSelect={false}
        components={Animated}
        // defaultValue={[
        //   { value: 'private', label: 'private' },
        //   { value: 'mobile', label: 'mobile' }
        // ]}
        isMulti
        options={options}
        styles={colourStyles}
        isClearable={false}
        isDisabled={isDisabled}
        value={tags.map(tag => ({ value: tag, label: tag }))}
        // converting `tags` from ['mobile', 'landline']
        // to [
        //   { value: 'mobile', label: 'mobile' },
        //   { value: 'landline', label: 'landline' }
        // ]
        onChange={this.handleChange}
      />
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ updateTags }, dispatch);
}

export default connect(null, mapDispatchToProps)(SelectComponentStyled);

SelectComponentStyled.propTypes = {
  isDisabled: PropTypes.bool,
  targetArray: PropTypes.string.isRequired, // component modifies tags of `state.profile[targetArray]`
  index: PropTypes.number, // 'index' is not required if field is read-only
  tags: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired, // the already selected tags
  options: PropTypes.arrayOf(
    // the tags the user can select from
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    }).isRequired
  ).isRequired
  // allParents: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  // validParents: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired
  // familyById: PropTypes.objectOf(
  //   PropTypes.shape({
  //     firstName: PropTypes.string.isRequired
  //   })
  // ).isRequired
};

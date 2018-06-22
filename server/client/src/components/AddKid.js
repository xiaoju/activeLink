import React from 'react';
import PropTypes from 'prop-types';

function AddKid(props) {
  return (
    <div className="schoolGrade">
      <label>Grade</label>
      <select
        name="kidGrade-new"
        className="browser-default"
        value=""
        // onChange={this.handleChange}
      >
        <option value="PS">PS</option>
        <option value="MS">MS</option>
        <option value="GS">GS</option>
        <option disabled>──</option>
        <option value="CP">CP</option>
        <option value="CE1">CE1</option>
        <option value="CE2">CE2</option>
        <option value="CM1">CM1</option>
        <option value="CM2">CM2</option>
        <option disabled>──</option>
        <option value="older">other</option>
      </select>
    </div>
  );
}

export default AddKid;

AddKid.propTypes = {
  // id: PropTypes.string.isRequired,
};

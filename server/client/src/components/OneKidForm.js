import React from 'react';
// import PropTypes from 'prop-types';

function OneKidForm({ firstName, familyName, schoolGrade }) {
  return (
    <form className="formInputsContainer">
      <div className="twoNamesContainer">
        <div className="input-field firstName">
          <i className="material-icons prefix">face</i>
          <input
            id="icon_prefix"
            type="text"
            className="validate"
            value={firstName}
          />
          <label htmlFor="icon_prefix" className="active">
            First Name
          </label>
        </div>

        <div className="input-field familyName">
          <input
            id="icon_prefix"
            type="text"
            className="validate"
            value={familyName}
          />
          <label htmlFor="icon_prefix" className="active">
            Family Name
          </label>
        </div>
      </div>
      {/* <form onSubmit={this.handleSubmit}> */}
      <div className="schoolGrade">
        <label>
          {/* Select School Grade */}
          <select
            className="browser-default"
            value={schoolGrade}

            // value={this.state.value}
            // onChange={this.handleChange}
          >
            {/* <option value="" disabled selected>
              School Grade 2018-1019
            </option> */}
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
            <option value="older">older</option>
          </select>
        </label>
      </div>
      {/* <input type="submit" value="Submit" /> */}
      {/* </form> */}
    </form>
  );
}

export default OneKidForm;

// OneKidForm.propTypes = {
//   itemId: PropTypes.string.isRequired,
// };

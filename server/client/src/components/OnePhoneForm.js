import React from 'react';
import PropTypes from 'prop-types';

function OnePhoneForm({ phoneItem }) {
  return (
    <form className="formInputsContainer OnePhoneContainer">
      <div className="input-field twoNamesContainer">
        <i className="material-icons prefix">phone</i>
        <input
          id={phoneItem.it}
          type="tel"
          className="validate"
          value={phoneItem.it}
        />
        <label htmlFor={phoneItem.it} className="active">
          {/* Telephone */}
        </label>
      </div>

      {/* <div>
        <label>
          <select className="browser-default">
            <option value="Mobile">Mobile</option>
            <option value="Landline">Landline</option>
            <option value="Professional mobile">Professional mobile</option>
            <option value="Professional landline">Professional landline</option>
            <option value="Private mobile">Private mobile</option>
            <option value="Private landline">Private landline</option>
            <option value="custom">custom</option>
          </select>
        </label>
        <i className="material-icons prefix">phone</i>
      </div> */}

      <div className="columnContainer schoolGrade">
        {phoneItem.tags.map(tag => (
          <div className="chip">
            {tag}
            <i className="close material-icons">close</i>
          </div>
        ))}
      </div>
    </form>
  );
}

export default OnePhoneForm;

OnePhoneForm.propTypes = {
  phoneItem: PropTypes.object.isRequired
};

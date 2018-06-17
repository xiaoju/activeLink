import React from 'react';
import PropTypes from 'prop-types';

function OneParentForm(props) {
  return (
    <form className="container formInputsContainer">
      <div className="input-field">
        <i className="material-icons prefix">account_circle</i>
        <input id="icon_prefix" type="text" className="validate" />
        <label htmlFor="icon_prefix" className="active">
          First Name
        </label>
      </div>
      <div className="input-field">
        {/* <i className="material-icons prefix">account_circle</i> */}
        <input id="icon_prefix" type="text" className="validate" />
        <label htmlFor="icon_prefix" className="active">
          Family Name
        </label>
      </div>
      <div className="input-field">
        <i className="material-icons prefix">email</i>
        <input id="email" type="email" className="validate" />
        <label htmlFor="email" className="active">
          Email
        </label>
      </div>

      <div>
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
      </div>
      <div className="input-field">
        {/* <i className="material-icons prefix">phone</i> */}
        <input id="icon_telephone" type="tel" className="validate" />
        <label htmlFor="icon_telephone" className="active">
          {/* Telephone */}
        </label>
      </div>

      <div>
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
      </div>
      <div className="input-field">
        {/* <i className="material-icons prefix">phone</i> */}
        <input id="icon_telephone" type="tel" className="validate" />
        <label htmlFor="icon_telephone" className="active">
          {/* Telephone */}
        </label>
      </div>
    </form>
  );
}

export default OneParentForm;

// OneParentForm.propTypes = {
//   itemId: PropTypes.string.isRequired,
// };

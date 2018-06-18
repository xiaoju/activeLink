import React from 'react';

function TelephoneForm(props) {
  return (
    <form className="container formInputsContainer">
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

export default TelephoneForm;

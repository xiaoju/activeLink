import React from 'react';

function OneParentForm({ firstName, familyName }) {
  return (
    <form className="formInputsContainer">
      <div className="twoNamesContainer">
        <div className="input-field firstName">
          <i className="material-icons prefix">account_circle</i>
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
      {/* <div className=""> </div> */}
    </form>
  );
}

export default OneParentForm;

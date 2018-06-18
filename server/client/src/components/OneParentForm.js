import React from 'react';

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
        <input id="icon_prefix" type="text" className="validate" />
        <label htmlFor="icon_prefix" className="active">
          Family Name
        </label>
      </div>
    </form>
  );
}

export default OneParentForm;

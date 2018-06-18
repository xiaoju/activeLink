import React from 'react';

function EmailForm(props) {
  return (
    <form className="container formInputsContainer">
      <div className="input-field">
        <i className="material-icons prefix">email</i>
        <input id="email" type="email" className="validate" />
        <label htmlFor="email" className="active">
          Email
        </label>
      </div>
    </form>
  );
}

export default EmailForm;

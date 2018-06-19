import React from 'react';
import PropTypes from 'prop-types';

function OneEmailForm({ emailObject }) {
  return (
    <form className="formInputsContainer OnePhoneContainer">
      <div className="input-field twoNamesContainer">
        <i className="material-icons prefix">email</i>
        <input
          id="email"
          type="email"
          className="validate"
          value={emailObject.it}
        />
      </div>

      <div className="columnContainer schoolGrade">
        {emailObject.tags.map(tag => (
          <div key={tag} className="chip">
            {tag}
            <i className="close material-icons">close</i>
          </div>
        ))}
      </div>
    </form>
  );
}

export default OneEmailForm;

OneEmailForm.propTypes = {
  emailObject: PropTypes.object.isRequired
};

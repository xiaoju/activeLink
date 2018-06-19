import React from 'react';
import PropTypes from 'prop-types';

function OneEmailForm({ emailItem }) {
  return (
    <form className="formInputsContainer OnePhoneContainer">
      <div className="input-field twoNamesContainer">
        <i className="material-icons prefix">email</i>
        <input
          id="email"
          type="email"
          className="validate"
          value={emailItem.it}
        />
      </div>

      <div className="columnContainer schoolGrade">
        {emailItem.tags.map(tag => (
          <div className="chip">
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
  emailItem: PropTypes.object.isRequired
};

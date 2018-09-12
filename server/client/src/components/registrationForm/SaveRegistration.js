import React from 'react';

function SaveRegistration(props) {
  return (
    <div className="itemsContainer hoverable">
      <div className="innerContainer">
        <h4 className="stepTitle">{props.sectionTitle}</h4>
        <div className="title_and_button">
          <strong>
            <h5>Save!</h5>
          </strong>
        </div>
      </div>
    </div>
  );
}

export default SaveRegistration;

import React from 'react';

function Sorry() {
  return (
    <div className="itemsContainer hoverable">
      <div className="innerContainer">
        <h4 className="stepTitle">Something went wrong!</h4>
        <div className="title_and_button">
          <strong>
            <h5>
              Sorry for this! :-(
              <br />
              Would you please try again or contact our team?
            </h5>
          </strong>
        </div>
      </div>
    </div>
  );
}

export default Sorry;

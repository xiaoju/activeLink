import React from 'react';

function PageNotFound() {
  return (
    <div className="itemsContainer hoverable">
      <div className="innerContainer">
        <h4 className="stepTitle">404 errror</h4>
        <div className="title_and_button">
          <strong>
            <h5>
              We couldn't find the page you're looking for.
              <br />
              <br />
              Sorry for this! :-(
            </h5>
          </strong>
        </div>
      </div>
    </div>
  );
}

export default PageNotFound;

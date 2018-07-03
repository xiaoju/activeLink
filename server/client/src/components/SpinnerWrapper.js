import React from 'react';

function SpinnerWrapper() {
  return (
    <div>
      <br />
      <h5 className="stepTitle">Loading...</h5>
      <br />
      <div className="preloader-wrapper active">
        <div className="spinner-layer spinner-red-only">
          <div className="circle-clipper left">
            <div className="circle" />
          </div>
          <div className="gap-patch">
            <div className="circle" />
          </div>
          <div className="circle-clipper right">
            <div className="circle" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SpinnerWrapper;

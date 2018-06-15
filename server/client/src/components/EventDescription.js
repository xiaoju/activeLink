import React from 'react';

function EventDescription({ eventName }) {
  return (
    <div className="card deep-purple lighten-2">
      <div className="card-content">
        <span className="card-title">
          <strong>{eventName}</strong>
        </span>
      </div>
    </div>
  );
}

export default EventDescription;

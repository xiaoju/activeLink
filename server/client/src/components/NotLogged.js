import React from 'react';
import PageSection from './layout/PageSection';

function MyClasses() {
  return (
    <PageSection sectionTitle="Members Area">
      <div className="innerContainer">
        <div className="title_and_button">
          <strong>
            <h5>Please log in to enter the members area.</h5>
          </strong>
        </div>
      </div>
    </PageSection>
  );
}

export default MyClasses;

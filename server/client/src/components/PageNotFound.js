import React from 'react';
import PageSection from './layout/PageSection';

function PageNotFound() {
  return (
    <PageSection sectionTitle="404 errror">
      <div className="innerContainer">
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
    </PageSection>
  );
}

export default PageNotFound;

import React from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from './ErrorBoundary';

function PageSection(props) {
  return (
    <div className="itemsContainer hoverable">
      <h4 className="stepTitle">{props.sectionTitle}</h4>
      <ErrorBoundary>{props.children}</ErrorBoundary>
    </div>
  );
}

export default PageSection;

PageSection.propTypes = {
  sectionTitle: PropTypes.string.isRequired
};

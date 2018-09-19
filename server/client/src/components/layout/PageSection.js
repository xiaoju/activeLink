import React from 'react';
import PropTypes from 'prop-types';

function PageSection(props) {
  return (
    <div className="itemsContainer hoverable">
      <h4 className="stepTitle">{props.sectionTitle}</h4>
      {props.children}
    </div>
  );
}

export default PageSection;

PageSection.propTypes = {
  sectionTitle: PropTypes.string.isRequired
};

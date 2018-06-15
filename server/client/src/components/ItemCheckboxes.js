import React from 'react';
import PropTypes from 'prop-types';

function ItemCheckboxes(props) {
  return (
    <div>
      {console.log['CheckBoxesComponent: ']}
      {console.log[('props.itemId: ', props.itemId)]}
      {console.log[('props.users: ', props.users)]}
      {Object.keys(props.users)
        // only show boxes for this item if kid is in the right grade for it
        .filter(thisUserId =>
          props.users[thisUserId].items.includes(props.itemId)
        )
        .map(thisUserId => (
          <div
            className="usernameCheckbox"
            key={props.itemId + '_' + thisUserId}
          >
            <input
              type="checkbox"
              onChange={thisEvent =>
                props.checked[thisUserId].includes(props.itemId)
                  ? // if already in array
                    props.uncheckCheckbox(thisUserId, props.itemId, thisEvent)
                  : // if not yet in array
                    props.checkCheckbox(thisUserId, props.itemId, thisEvent)
              }
              id={props.itemId + '_' + thisUserId}
              className="filled-in checkbox-orange z-depth-2"
              // TODO "z-depth-2" for shadow effect is not working!
              // using the checkbox data from checkedReducer
              checked={
                props.checked[thisUserId].includes(props.itemId) && 'checked'
              }
            />

            <label htmlFor={props.itemId + '_' + thisUserId}>
              {props.users[thisUserId].label}
            </label>
          </div>
        ))}
    </div>
  );
}

export default ItemCheckboxes;

ItemCheckboxes.propTypes = {
  itemId: PropTypes.string.isRequired,
  users: PropTypes.object.isRequired,
  checked: PropTypes.object.isRequired,
  uncheckCheckbox: PropTypes.func.isRequired,
  checkCheckbox: PropTypes.func.isRequired
};

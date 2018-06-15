import React from 'react';
import PropTypes from 'prop-types';

function ItemCheckboxes({
  familyItems,
  familyMembers,
  itemId,
  familyId,
  familyName,
  kids,
  items,
  checked,
  uncheckCheckbox,
  checkCheckbox,
  mandatoryItems
}) {
  return (
    <div>
      {(familyItems.includes(itemId)
        ? // handle separately items that are priced per family vs priced per kid
          familyId
        : kids.filter(
            // filter out the kids whose grade doesn't match the requested grades for this class
            thisUserId =>
              items[itemId].itemGrades.includes(
                familyMembers[thisUserId].kidGrade
              )
          )
      ).map(thisUserId => (
        <div className="usernameCheckbox" key={itemId + '_' + thisUserId}>
          <input
            type="checkbox"
            onChange={thisEvent =>
              checked[thisUserId].includes(itemId)
                ? // if already in array
                  uncheckCheckbox(thisUserId, itemId, thisEvent)
                : // if not yet in array
                  checkCheckbox(thisUserId, itemId, thisEvent)
            }
            id={itemId + '_' + thisUserId}
            className="filled-in checkbox-orange z-depth-2"
            // TODO "z-depth-2" for shadow effect is not working!
            // using the checkbox data from checkedReducer
            checked={
              mandatoryItems.includes(itemId) ||
              (checked[thisUserId].includes(itemId) && 'checked')
            }
          />

          {familyItems.includes(itemId) ? (
            <label htmlFor={itemId + '_' + thisUserId}>{familyName}</label>
          ) : (
            <label htmlFor={itemId + '_' + thisUserId}>
              {familyMembers[thisUserId].firstName}
            </label>
          )}
        </div>
      ))}
    </div>
  );
}

export default ItemCheckboxes;

ItemCheckboxes.propTypes = {
  familyItems: PropTypes.array.isRequired,
  familyMembers: PropTypes.object.isRequired,
  itemId: PropTypes.string.isRequired,
  familyId: PropTypes.array.isRequired,
  familyName: PropTypes.string.isRequired,
  kids: PropTypes.array.isRequired,
  items: PropTypes.object.isRequired,
  checked: PropTypes.object.isRequired,
  uncheckCheckbox: PropTypes.func.isRequired,
  checkCheckbox: PropTypes.func.isRequired,
  mandatoryItems: PropTypes.array.isRequired
};

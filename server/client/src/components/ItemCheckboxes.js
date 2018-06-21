import React from 'react';
import PropTypes from 'prop-types';

function ItemCheckboxes({
  familyItems,
  familyPerId,
  itemId,
  mergedFamilyName,
  itemsPerId,
  checked,
  uncheckCheckbox,
  checkCheckbox,
  mandatoryItems,
  checkboxUsers
}) {
  return (
    // this component creates one checkbox per kid, or one for the family in
    // case of pricing per family
    <div>
      {(familyItems.includes(itemId)
        ? // handle separately items that are priced per family vs priced per kid
          [checkboxUsers[0]] // [familyId]
        : checkboxUsers.slice(1)
      ).map(thisUserId => (
        <div
          className={
            !familyItems.includes(itemId) && // familyItems don't have requiredGrades but still should not be disabled!
            !itemsPerId[itemId].itemGrades.includes(
              familyPerId[thisUserId].kidGrade
            )
              ? 'usernameCheckboxDisabled'
              : 'usernameCheckbox'
          } // color of label (name of kid) is greyed out when kid not the right grade for the class
          // BUG in filter just above.
          key={itemId + '_' + thisUserId}
        >
          <input
            type="checkbox"
            onChange={thisEvent =>
              !mandatoryItems.includes(itemId) &&
              (checked[thisUserId].includes(itemId)
                ? // if already in array
                  uncheckCheckbox(thisUserId, itemId, thisEvent)
                : // if not yet in array
                  checkCheckbox(thisUserId, itemId, thisEvent))
            }
            id={itemId + '_' + thisUserId}
            className="filled-in checkbox-orange z-depth-2"
            checked={checked[thisUserId].includes(itemId) && 'checked'}
            disabled={
              !familyItems.includes(itemId) &&
              !itemsPerId[itemId].itemGrades.includes(
                familyPerId[thisUserId].kidGrade
              ) &&
              'disabled'
            }
          />
          {familyItems.includes(itemId) ? (
            <label htmlFor={itemId + '_' + thisUserId}>
              {mergedFamilyName}
            </label>
          ) : (
            <label htmlFor={itemId + '_' + thisUserId}>
              {familyPerId[thisUserId].firstName}
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
  familyPerId: PropTypes.object.isRequired,
  itemId: PropTypes.string.isRequired,
  mergedFamilyName: PropTypes.string.isRequired,
  itemsPerId: PropTypes.object.isRequired,
  checked: PropTypes.object.isRequired,
  uncheckCheckbox: PropTypes.func.isRequired,
  checkCheckbox: PropTypes.func.isRequired,
  mandatoryItems: PropTypes.array.isRequired,
  checkboxUsers: PropTypes.array.isRequired
};

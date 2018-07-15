import React from 'react';
import PropTypes from 'prop-types';

function ItemCheckboxes({
  familyItems,
  familyById,
  itemId,
  mergedFamilyName,
  itemsById,
  checked,
  uncheckCheckbox,
  checkCheckbox,
  mandatoryItems,
  familyId,
  validKids
}) {
  return (
    // this component creates one checkbox per kid, or
    // one only, for the family, in case of pricing per family
    <div>
      {(familyItems.includes(itemId)
        ? // handle separately items that are priced per family vs priced per kid
          [familyId] // ['familyId']
        : // ['family']
          validKids
      ).map(thisUserId => (
        <div
          className={
            !familyItems.includes(itemId) && // familyItems don't have requiredGrades but still should not be disabled!
            !itemsById[itemId].itemGrades.includes(
              familyById[thisUserId].kidGrade
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
              !itemsById[itemId].itemGrades.includes(
                familyById[thisUserId].kidGrade
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
              {familyById[thisUserId].firstName}
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
  familyById: PropTypes.object.isRequired,
  itemId: PropTypes.string.isRequired,
  mergedFamilyName: PropTypes.string.isRequired,
  itemsById: PropTypes.object.isRequired,
  checked: PropTypes.object.isRequired,
  uncheckCheckbox: PropTypes.func.isRequired,
  checkCheckbox: PropTypes.func.isRequired,
  mandatoryItems: PropTypes.array.isRequired,
  familyId: PropTypes.string.isRequired,
  validKids: PropTypes.array.isRequired
};

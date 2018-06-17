import React from 'react';
import PropTypes from 'prop-types';

function ItemCheckboxes({
  familyItems,
  familyMembers,
  itemId,
  familyName,
  items,
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
      ) // [kid1Id, kid2Id] // either [familyId], either [kid1Id, kid2Id], depending on the value of itemId
        // .filter(
        //   // filter out the kids whose grade doesn't match the requested grades for this class
        //   thisUserId =>
        //     items[itemId].itemGrades.includes(
        //       familyMembers[thisUserId].kidGrade
        //     )
        // )
        .map(thisUserId => (
          <div
            className={
              !familyItems.includes(itemId) &&
              items[itemId].itemGrades.includes(
                familyMembers[thisUserId].kidGrade
              )
                ? 'usernameCheckboxDisabled'
                : 'usernameCheckbox'
            } // color of label (name of kid) is greyed out when kid not the right grade for the class
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
              // TODO "z-depth-2" for shadow effect is not working!
              // using the checkbox data from checkedReducer
              checked={checked[thisUserId].includes(itemId) && 'checked'}
              disabled={
                !familyItems.includes(itemId) &&
                items[itemId].itemGrades.includes(
                  familyMembers[thisUserId].kidGrade
                ) &&
                'disabled'
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
  familyName: PropTypes.string.isRequired,
  items: PropTypes.object.isRequired,
  checked: PropTypes.object.isRequired,
  uncheckCheckbox: PropTypes.func.isRequired,
  checkCheckbox: PropTypes.func.isRequired,
  mandatoryItems: PropTypes.array.isRequired,
  checkboxUsers: PropTypes.array.isRequired
};

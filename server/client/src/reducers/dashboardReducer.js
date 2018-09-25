import { LOAD_DASHBOARD } from '../actions/types';

const empty = {
  loaded: false,
  kidsByGrade: {},
  registrationItems: [],
  classItems: [],
  volunteeringItems: [],
  registrationsByItem: {},
  FamiliesRegistered: [],
  FamiliesNotRegistered: [],
  NoPhotoconsentKids: [],
  // usersDetails: [],
  // kidsByFamily: [],
  FamilyIdbyKidId: {},
  // parentsByFamily: [],
  FamilyIdByParentId: {},
  // familyDetails: [],
  // itemDetails: [],
  itemsById: {},
  kidsQuantity: 0,
  kidsInClasses: 0,
  parentsQuantity: 0,
  volunteers: []
  // volunteersById: {}
};

export default function(state = empty, { type, payload }) {
  switch (type) {
    case LOAD_DASHBOARD: {
      return {
        ...payload,
        usersDetails: undefined,
        familyDetails: undefined,
        itemDetails: undefined,
        kidsByFamily: undefined,
        parentsByFamily: undefined,
        // volunteers: undefined,
        loaded: true,
        itemsById: payload.itemDetails[0], // TODO store items in a mongo collection, like usersDetails and familiesDetails
        usersById: payload.usersDetails.reduce((obj, userObject) => {
          obj[userObject.id] = userObject;
          return obj;
        }, {}),
        familiesById: payload.familyDetails.reduce((obj, userObject) => {
          obj[userObject.familyId] = userObject;
          return obj;
        }, {}),
        FamilyIdbyKidId: payload.kidsByFamily.reduce((obj, KidFamilyObj) => {
          obj[KidFamilyObj.kidId] = KidFamilyObj;
          return obj;
        }, {}),
        FamilyIdByParentId: payload.parentsByFamily.reduce(
          (obj, ParentFamilyObj) => {
            obj[ParentFamilyObj.parentId] = ParentFamilyObj;
            return obj;
          },
          {}
        ),
        familiesRegisteredQuantity: payload.FamiliesRegistered.length,
        familiesNotRegisteredQuantity: payload.FamiliesNotRegistered.length

        // volunteersById: payload.volunteers.reduce((obj, userObject) => {
        //   obj[userObject.familyId] = userObject;
        //   return obj;
        // }, {})
      };
    }

    default:
      return state;
  }
}

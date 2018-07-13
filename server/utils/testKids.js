module.exports = ({ allKids, familyById }) => {
  const isValidGrade = (familyById, userId) =>
    familyById[userId].kidGrade !== ' ';

  const isValidFirstName = (familyById, userId) =>
    familyById[userId].firstName !== '';

  const isValidFamilyName = (familyById, userId) =>
    familyById[userId].familyName !== '';

  const isValidUser = userId =>
    isValidFirstName(familyById, userId) &&
    isValidFamilyName(familyById, userId) &&
    isValidGrade(familyById, userId);

  const numberInvalidKids = allKids.filter(kidId => !isValidUser(kidId)).length;

  // const validKids = allKids.filter(isValidUser);
  //
  // // Checking that the allKids array received from frontend was already valid,
  // // by comparing it to "itself after cleanup" (i.e. validKids):
  // console.log('testKids // allKids: ', allKids);
  // console.log('testKids // validKids: ', validKids);
  // const errorValidKids = validKids !== allKids;

  return numberInvalidKids;
  // return 2; // for testing of handling of these validation errors
};

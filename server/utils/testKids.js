module.exports = ({ allKids, familyById }) => {
  const isValidGrade = (familyById, userId) =>
    familyById[userId].kidGrade !== ' ';

  const isValidFirstName = (familyPerId, userId) =>
    familyById[userId].firstName !== '';

  const isValidFamilyName = (familyPerId, userId) =>
    familyById[userId].familyName !== '';

  const isValidUser = userId =>
    isValidFirstName(familyById, userId) &&
    isValidFamilyName(familyById, userId) &&
    isValidGrade(familyById, userId);

  const validKids = allKids.filter(isValidUser);

  // Checking that the allKids array received from frontend was already valid,
  // by comparing it to "itself after cleanup" (i.e. validKids):
  const errorValidKids = validKids !== allKids;

  return errorValidKids;
};

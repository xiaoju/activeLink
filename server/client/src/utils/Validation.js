export function validateEmail(string) {
  const emailRegex = /^\S+@\S+\.\S+$/;
  return emailRegex.test(string);
}

export function validateNumber(string) {
  const numberRegex = /^\d+$/;
  return numberRegex.test(string);
}

// export function areValidUsers(usersIdArray) {
//   return usersIdArray.filter(userId => isValidUser(userId));
// }
//
// export function isValidUser(userId) {
//   return (
//     isValidFirstName(userId) &&
//     isValidFamilyName(userId) &&
//     isValidGrade(userId)
//   );
// }
//
// export function isValidGrade(userId) {
//   return !!familyById[userId].kidGrade && familyById[userId].kidGrade !== '_';
// }
//
// export function isValidFamilyName(userId) {
//   return (
//     !!familyById[userId].familyName && familyById[userId].familyName !== ''
//   );
// }
//
// export function isValidFirstName(userId) {
//   return (
//     !!familyById[userId].firstName && familyById[userId].firstName !== ''
//   );
// }

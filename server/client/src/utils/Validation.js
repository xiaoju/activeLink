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
//   return !!familyPerId[userId].kidGrade && familyPerId[userId].kidGrade !== '_';
// }
//
// export function isValidFamilyName(userId) {
//   return (
//     !!familyPerId[userId].familyName && familyPerId[userId].familyName !== ''
//   );
// }
//
// export function isValidFirstName(userId) {
//   return (
//     !!familyPerId[userId].firstName && familyPerId[userId].firstName !== ''
//   );
// }

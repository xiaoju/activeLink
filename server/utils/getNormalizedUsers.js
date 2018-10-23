const mongoose = require('mongoose');
const User = mongoose.model('users');
const wrapAsync = require('./wrapAsync');

module.exports = wrapAsync(async allKidsAndParents => {
  usersArray = await User.find({ id: { $in: allKidsAndParents } }); // [{id, firstName, familyName, kidGrade},{},...]

  const normalizedUsers = usersArray.reduce((obj, thisUser) => {
    obj[thisUser.id] = thisUser;
    return obj;
  }, {});

  // TODO add familyId to the normalizedUsers, to avoid bug when looking up info about the familyItems
  // TODO try get registrations directly through a (nested) database query
  // const registrations = await Asso.find({
  //   userId: { $in: allKidsAndParents }
  // });

  return normalizedUsers;
});

const mongoose = require('mongoose');
const Family = mongoose.model('families');
const Asso = mongoose.model('assos');
const User = mongoose.model('users');
const Registration = mongoose.model('registrations');
const wrapAsync = require('./wrapAsync');

module.exports = wrapAsync(async () => {
  // TODO get allKidGrades, registrationItems, classItems and volunteeringItems from Asso document
  let allKidGrades = [
    ['PS', 'MS', 'GS'],
    ['CP', 'CE1', 'CE2', 'CM1', 'CM2'],
    ['6e', '5e', '4e', '3e']
  ];
  let registrationItems = ['i0'];
  let classItems = ['i1', 'i2', 'i3', 'i4', 'i5', 'i6', 'i7', 'i8'];
  let volunteeringItems = [
    'i9',
    'i10',
    'i11',
    'i12',
    'i13',
    'i14',
    'i15',
    'i16',
    'i17',
    'i18',
    'i19',
    'i20',
    'i21'
  ];

  // let assoId = 'a0';
  // get the registrations, the old way (from Asso.registrations)
  // const thisAsso = await Asso.find({ id: assoId });
  // a0Registrations = thisAsso[0].registrations;
  // flatRegistrations = Object.keys(a0Registrations)
  //   .map(clientId =>
  //     a0Registrations[clientId].map(itemId => ({ itemId, clientId }))
  //   )
  //   .reduce((output, smallArray) => output.concat(smallArray), []);

  // get the registrations, the new way (from Registrations collection)
  //  const TheseRegistrations = await Registration.aggregate([
  //     {
  //       $group: {
  //         _id: '$itemId',
  //         count: { $sum: 1 }
  //       }
  //     },
  //     { $sort: { _id: 1 } }
  //     // { $project: { itemId: '$_id' } }
  //   ]);

  // TODO should save items as mongoDB collection instead redux style keyed object!
  const itemDetails = await Asso.aggregate([
    {
      $replaceRoot: { newRoot: '$itemsById' }
    }
  ]);

  const usersDetails = await User.find({}).select(
    '-_id id firstName familyName kidGrade'
  );

  const familyDetails = await Family.find({}).select(
    '-_id familyId primaryEmail photoConsent addresses familyMedia allKids allParents'
  );

  const kidsByFamily = await Family.aggregate([
    {
      $project: {
        _id: 0,
        familyId: 1,
        kidId: '$allKids'
      }
    },
    { $unwind: '$kidId' }
  ]);

  const parentsByFamily = await Family.aggregate([
    {
      $project: {
        _id: 0,
        familyId: 1,
        ParentId: '$allParents'
      }
    },
    { $unwind: '$ParentId' }
  ]);

  const NoPhotoconsentKids = await Family.distinct('allKids', {
    photoConsent: false
  });

  const FamiliesNotRegistered = await Family.distinct('familyId', {
    registeredEvents: []
  });

  // TODO get familiesRegistered as families who registered 'i0'
  const FamiliesRegistered = await Family.distinct('familyId', {
    registeredEvents: { $ne: [] }
  });

  const kidsQuantity = await User.find({
    kidGrade: { $ne: null }
  }).countDocuments();

  let registrationsByItem = {};
  await Promise.all(
    []
      .concat(registrationItems, classItems, volunteeringItems)
      .map(async itemId => {
        registrationsByItem[itemId] = await Registration.distinct('clientId', {
          itemId
        });
      })
  );

  const kidsInClasses = await Registration.distinct('clientId', {
    clientId: {
      $nin: FamiliesRegistered
    }
  });

  let KidsByGrade = {};
  await Promise.all(
    [...new Set([].concat(...allKidGrades))].map(async kidGrade => {
      KidsByGrade[kidGrade] = await User.distinct('id', {
        kidGrade
      });
    })
  );

  // volunteers = await Registration.find({itemId: { $in: volunteeringItems }}).select('-_id itemId clientId');
  const volunteers = await Registration.aggregate([
    { $project: { _id: 0, itemId: 1, clientId: 1 } },
    { $match: { itemId: { $in: volunteeringItems } } },
    {
      $group: {
        _id: '$clientId',
        volunteeringItemIds: { $push: '$itemId' }
      }
    },
    {
      $project: {
        _id: 0,
        familyId: '$_id',
        volunteeringItemIds: 1
      }
    }
  ]);

  const output = {
    kidsInClasses,
    volunteers,
    KidsByGrade,
    registrationItems,
    classItems,
    volunteeringItems,
    registrationsByItem,
    FamiliesRegistered,
    FamiliesNotRegistered,
    NoPhotoconsentKids,
    usersDetails,
    kidsByFamily,
    parentsByFamily,
    familyDetails,
    itemDetails,
    kidsQuantity
  };

  return output;
});

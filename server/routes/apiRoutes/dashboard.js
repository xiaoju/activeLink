const router = require('express').Router();
const mongoose = require('mongoose');
const Family = mongoose.model('families');
const Asso = mongoose.model('assos');
const User = mongoose.model('users');
const Registration = mongoose.model('registrations');
const requireLogin = require('../../middlewares/requireLogin');
const requireAdmin = require('../../middlewares/requireAdmin');

router.get('/', requireLogin, requireAdmin, async function(req, res) {
  console.log('DASHBOARD opened by ', req.user.primaryEmail);
  let assoId = 'a0';

  let volunteers,
    FamiliesNotRegistered,
    FamiliesRegistered,
    registrations,
    csvexport,
    itemDetails,
    kidsByFamily,
    parentsByFamily,
    KidsNoPhoto,
    usersDetails,
    familyDetails,
    NoPhotoconsentKids,
    kidsQuantity,
    kidsInClasses,
    parentsQuantity,
    clientsByItem;

  // get the registrations, the old way (from Asso.registrations)
  // try {
  //   thisAsso = await Asso.find({ id: assoId });
  // } catch (err) {
  //   console.log('adminRoutes, 21, query error: ', err);
  //   res.status(500).json({ error: err.toString() });
  // }
  // a0Registrations = thisAsso[0].registrations;
  // flatRegistrations = Object.keys(a0Registrations)
  //   .map(clientId =>
  //     a0Registrations[clientId].map(itemId => ({ itemId, clientId }))
  //   )
  //   .reduce((output, smallArray) => output.concat(smallArray), []);

  // get the registrations, the new way (from Registrations collection)
  // let TheseRegistrations;
  // try {
  //   TheseRegistrations = await Registration.aggregate([
  //     {
  //       $group: {
  //         _id: '$itemId',
  //         count: { $sum: 1 }
  //       }
  //     },
  //     { $sort: { _id: 1 } }
  //     // { $project: { itemId: '$_id' } }
  //   ]);
  // } catch (err) {
  //   console.log('adminRoutes, 102, error: ', err);
  //   res.status(500).json({ error: err.toString() });
  // }

  // ITEMS DETAILS
  // should save items as mongoDB collection instead redux style keyed object!
  try {
    itemDetails = await Asso.aggregate([
      {
        $replaceRoot: { newRoot: '$itemsById' }
      }
      // {
      //   $project: {
      //     _id: 0,
      //     id: 1,
      //     name: 1,
      //     period: 1,
      //     standardPrice: 1,
      //     discountedPrice: 1,
      //     type: 1,
      //     discountQualifier: 1,
      //     mandatoryItem: 1,
      //     audience: 1,
      //     description: 1,
      //     itemGrades: 1
      //   }
      // }
    ]);
  } catch (err) {
    console.log('adminRoutes, 100, error: ', err);
    res.status(500).json({ error: err.toString() });
  }

  try {
    usersDetails = await User.find({}).select(
      '-_id id firstName familyName kidGrade'
    );
  } catch (err) {
    console.log('adminRoutes, 21, query error: ', err);
    res.status(500).json({ error: err.toString() });
  }

  try {
    familyDetails = await Family.find({}).select(
      '-_id familyId primaryEmail photoConsent addresses familyMedia allKids allParents'
    );
  } catch (err) {
    console.log('adminRoutes, 47, query error: ', err);
    res.status(500).json({ error: err.toString() });
  }

  try {
    kidsByFamily = await Family.aggregate([
      {
        $project: {
          _id: 0,
          familyId: 1,
          kidId: '$allKids'
        }
      },
      { $unwind: '$kidId' }
    ]);
  } catch (err) {
    console.log('adminRoutes, 47, query error: ', err);
    res.status(500).json({ error: err.toString() });
  }

  try {
    parentsByFamily = await Family.aggregate([
      {
        $project: {
          _id: 0,
          familyId: 1,
          ParentId: '$allParents'
        }
      },
      { $unwind: '$ParentId' }
    ]);
  } catch (err) {
    console.log('adminRoutes, 47, query error: ', err);
    res.status(500).json({ error: err.toString() });
  }

  try {
    NoPhotoconsentKids = await Family.distinct('allKids', {
      photoConsent: false
    });
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }

  try {
    FamiliesNotRegistered = await Family.distinct('familyId', {
      registeredEvents: []
    });
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }

  // TODO get familiesRegistered as families who registered 'i0'
  try {
    FamiliesRegistered = await Family.distinct('familyId', {
      registeredEvents: { $ne: [] }
    });
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }

  try {
    // kidsQuantity = await User.find({kidGrade: {$exists: 1}}).countDocuments();
    kidsQuantity = await User.find({
      kidGrade: { $ne: null }
    }).countDocuments();
  } catch (err) {
    // console.log('adminRoutes, 29, query error: ', err);
    console.log('adminRoutes, adsfgh, error: ', err.toString());
    res.status(500).json({ error: err.toString() });
  }

  try {
    parentsQuantity = await User.find({
      kidGrade: null
    }).countDocuments();
  } catch (err) {
    // console.log('adminRoutes, 29, query error: ', err);
    console.log('adminRoutes, adsfgh, error: ', err.toString());
    res.status(500).json({ error: err.toString() });
  }

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
  // TODO get classItems and volunteeringItems from Asso document
  let registrationsByItem = {};
  try {
    await Promise.all(
      []
        .concat(registrationItems, classItems, volunteeringItems)
        .map(async itemId => {
          registrationsByItem[itemId] = await Registration.distinct(
            'clientId',
            {
              itemId
            }
          );
        })
    );
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }

  try {
    kidsInClasses = await Registration.distinct('clientId', {
      clientId: {
        $nin: FamiliesRegistered
      }
    });
  } catch (error) {
    res.status(500).json({ error: err.toString() });
  }

  let allKidGrades = [
    ['PS', 'MS', 'GS'],
    ['CP', 'CE1', 'CE2', 'CM1', 'CM2'],
    ['6e', '5e', '4e', '3e']
  ];
  // TODO get allKidGrades from Asso document
  let KidsByGrade = {};
  try {
    await Promise.all(
      [...new Set([].concat(...allKidGrades))].map(async kidGrade => {
        KidsByGrade[kidGrade] = await User.distinct('id', {
          kidGrade
        });
      })
    );
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }

  try {
    // volunteers = await Registration.find({itemId: { $in: volunteeringItems }}).select('-_id itemId clientId');

    volunteers = await Registration.aggregate([
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
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }

  res.status(201).json({
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
    kidsQuantity,
    parentsQuantity,
    KidsNoPhoto,
    csvexport
  });
});

module.exports = router;

const uuid = require('uuid4');
const mongoose = require('mongoose');
const Family = mongoose.model('families');
const Asso = mongoose.model('assos');
const User = mongoose.model('users');
const Registration = mongoose.model('registrations');
const requireLogin = require('../middlewares/requireLogin');
const requireAdmin = require('../middlewares/requireAdmin');
const requirePlatformAdmin = require('../middlewares/requirePlatformAdmin');

module.exports = app => {
  // take all the registrations from the asso document,
  // and feed the Registration with those records
  app.get(
    '/api/v1/rebuildregistrations',
    requireLogin,
    requireAdmin,
    async function(req, res) {
      let assoId = 'a0';
      console.log('Asso.find');
      try {
        thisAsso = await Asso.find({ id: assoId });
      } catch (err) {
        console.log('adminRoutes, 21, query error: ', err);
        res.status(500).json({ error: err.toString() });
      }

      console.log('build FlatArray');
      a0Registrations = thisAsso[0].registrations;
      let FlatArray = Object.keys(a0Registrations)
        .map(clientId =>
          a0Registrations[clientId].map(itemId => ({ itemId, clientId }))
        )
        .reduce((output, smallArray) => output.concat(smallArray), []);

      let outputRemove;
      try {
        outputRemove = await Registration.remove({});
      } catch (err) {
        console.log('ERROR by mongoose remove({}): ', err);
        res.status(500).json({ error: err.toString() });
      }
      console.log('deleted the existing Registration collection');

      let output;
      try {
        output = await Registration.insertMany(FlatArray, { ordered: false });
      } catch (err) {
        console.log('ERROR by mongoose insertMany(): ', err);
        res.status(500).json({ error: err.toString() });
      }
      console.log('finished insertMany');

      res.status(201).json({
        FlatArray
      });
    }
  );

  app.get('/api/v1/dashboard', requireLogin, requireAdmin, async function(
    req,
    res
  ) {
    // console.log('req.body: ', req.body);
    // let assoId = req.body.assoId;
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
        { $project: { _id: 0, familyId: 1, allKids: 1 } },
        { $unwind: '$allKids' }
      ]);
    } catch (err) {
      console.log('adminRoutes, 47, query error: ', err);
      res.status(500).json({ error: err.toString() });
    }

    try {
      parentsByFamily = await Family.aggregate([
        { $project: { _id: 0, familyId: 1, allParents: 1 } },
        { $unwind: '$allParents' }
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

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // exports a full dump of the database in json format
  app.get('/api/v1/dbdump', requireLogin, requirePlatformAdmin, async function(
    req,
    res
  ) {
    let assos, families, users, dbDump;

    try {
      assos = await Asso.find({});
    } catch (err) {
      console.log('dbDump error (assos): ', err);
      assos = { failed: true, error: err.toString() };
    }

    try {
      families = await Family.find({});
    } catch (err) {
      console.log('dbDump error (families): ', err);
      families = { failed: true, error: err.toString() };
    }

    try {
      users = await User.find({});
    } catch (err) {
      console.log('dbDump error (users): ', err);
      users = { failed: true, error: err.toString() };
    }

    dbDump = { assos, families, users };
    // res.status(201).json({ assos, families, users });

    res.status(201).json({ dbDump });
  });

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // INVITE NEW FAMILIES TO THE ASSO
  // TODO send mailgun emails to the newly invited families,
  // but only as an option to be clicked,
  // and with message that can be customized.
  // TODO if email already exists, maybe just need to add a new asso.
  app.put('/api/createFamilies', requireLogin, requireAdmin, async function(
    req,
    res
  ) {
    // ['doublon@example.com', 'doublon@example.com', 'old@example.com', 'new@example.com']

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // validate I have admin right for the asso where accounts should be created
    const myAssoArray = req.user.roles.admin;
    const selectedAsso = req.body.selectedAsso; // the asso in which the users should be added
    const frontendEmailsArray = req.body.emailsArray;
    console.log('myAssoArray: ', myAssoArray);
    console.log('selectedAsso: ', selectedAsso);
    console.log('frontendEmailsArray: ', frontendEmailsArray);
    if (!myAssoArray.includes(selectedAsso)) {
      console.log('adminRoutes, 61, error 401, unauthorized!');
      return res.status(401).send({
        error: 'You need admin rights.'
      });
    }

    // takes an email addresses array and create 1 'family' database document
    // for each email.
    let removeDoublons = arr => [...new Set(arr)];
    const emailsArray = removeDoublons(req.body.emailsArray);

    // filtering out invalid emails
    // checking format ( xxx@xxx.xxx )
    // TODO check formatting of email
    function validateEmail(string) {
      const emailRegex = /^\S+@\S+\.\S+$/;
      return emailRegex.test(string);
    }
    const goodFormatEmails = emailsArray.filter(email => validateEmail(email));
    const badFormatEmails = emailsArray.filter(email => !validateEmail(email));

    // Is this email already used by an existing account?
    // (using Promise.all because array.filter doesn't support an async condition)
    async function isNew(email) {
      // ouputs true if this email already got a record in database, false otherwise
      let existingFamily;
      try {
        existingFamily = await Family.findOne({ primaryEmail: email });
      } catch (error) {
        console.log('error by findOne: ', error);
        res.status(500).json({ error: error.toString() });
        // next(error);
      }
      return (newEmail = !existingFamily && email);
    }
    const results = await Promise.all(
      goodFormatEmails.map(async email => {
        const test = await isNew(email);
        return test;
      })
    ); // ['new1@example.com', false, 'new2@example.com']
    const newEmailsArray = results.filter(res => res); // ['new1@example.com', 'new2@example.com']

    // convert array of email strings into a ready-to-insert array of objects
    const formattedArray = newEmailsArray.map(email => ({
      primaryEmail: email,
      familyId: uuid(),
      dateCreated: Date.now(),
      roles: {
        admin: [],
        parent: ['a0'],
        teacher: []
      },
      roles: { a0: ['parent'] }
    }));

    // create the list of new familyIds
    const createdFamilyIds = formattedArray.map(obj => obj.familyId);

    // create the new documents in the database
    // NB in my (mlab.com) old version of MongoDB / Mongoose, insertMany is
    // buggy by handling of duplicates: it will stop if there is a duplicate.
    // This is why I sort out the duplicates before running insertMany.
    // Beware my solution is not very solid (esp. regarding catching errors of
    // insertMany that aren't not "duplicate error". E.g. if error, which
    // records were saved, which were not). Is ok until my mlab upgrades
    // their MongoDB. For more, see:
    // https://stackoverflow.com/questions/47141150/insertmany-handle-duplicate-errors
    let output;
    try {
      output = await Family.insertMany(formattedArray, { ordered: false });
    } catch (err) {
      console.log('ERROR by mongoose insertMany(): ', err);
      next(err);
      // TODO check the syntax "next"
      // console.log('ERROR by mongoose insertMany(): ', err);
      // res.status(500).send('ERROR by mongoose insertMany()');
    }

    // add the IDs of the newly created families to the allFamilies array in `assos` document
    let thisAsso;
    try {
      thisAsso = await Asso.findOne({ id: 'a0' });
    } catch (error) {
      console.log(error);
    }
    previousAllFamilies = thisAsso.allFamilies;
    newAllFamilies = [...new Set(previousAllFamilies.concat(createdFamilyIds))];
    let updatedAsso;
    try {
      updatedAsso = await thisAsso.set({ allFamilies: newAllFamilies });
    } catch (error) {
      console.log('adminRoute, row 137, error by replacing old data: ', error);
    }
    updatedAsso.save();

    // TODO send email to the emails in the list,
    // and to the logged in admin who created the accounts

    // send back the JSON answer
    const newEmails = output.map(thisFamily => thisFamily.primaryEmail);
    const newfamiliesByEmail = output.reduce(function(acc, cur) {
      acc[cur.primaryEmail] = cur;
      return acc;
    }, {});
    const duplicateEmails = emailsArray.filter(
      email => !newEmailsArray.includes(email)
    );
    res.status(201).json({
      newEmails,
      newfamiliesByEmail,
      badFormatEmails,
      duplicateEmails
    });

    // res.status(400).json({ error: 'Bad Request' });
    // res.status(500).json({ error: 'Internal Server Error' });
    // res.status(500).json({
    //   error: 'Database problem. Please try again later.'
    // });
  });
};

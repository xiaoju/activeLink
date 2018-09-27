var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Family = mongoose.model('families');
const Asso = mongoose.model('assos');
const User = mongoose.model('users');
const Registration = mongoose.model('registrations');
const requireLogin = require('../../middlewares/requireLogin');
const requireAdmin = require('../../middlewares/requireAdmin');
const uuid = require('uuid/v4');

// INVITE NEW FAMILIES TO THE ASSO
// TODO send mailgun emails to the newly invited families,
// but only as an option to be clicked,
// and with message that can be customized.
// TODO if email already exists, maybe just need to add a new asso.
router.put('/', requireLogin, requireAdmin, async function(req, res) {
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

module.exports = router;

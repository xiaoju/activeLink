const mongoose = require('mongoose');
const Family = mongoose.model('families');
const Asso = mongoose.model('assos');
const User = mongoose.model('users');
const Registration = mongoose.model('registrations');
const uuid = require('uuid/v4');
const wrapAsync = require('./wrapAsync');

module.exports = wrapAsync(async req => {
  const selectedAsso = req.body.selectedAsso || 'ao'; // the asso for which admin work is requested

  // takes an email addresses array and create 1 'family' database document
  // for each email.
  // ['doublon@example.com', 'doublon@example.com', 'old@example.com', 'new@example.com']

  // TODO send mailgun emails to the newly invited families,
  // but only as an option to be clicked,
  // and with message that can be customized.

  let removeDoublons = arr => [...new Set(arr)];
  const emailsArray = removeDoublons(req.body.emailsArray);

  function validateEmail(string) {
    const emailRegex = /^\S+@\S+\.\S+$/; // checking format xxx@xxx.xxx
    return emailRegex.test(string);
  }
  const goodFormatEmails = emailsArray.filter(email => validateEmail(email));
  const badFormatEmails = emailsArray.filter(email => !validateEmail(email));

  // TODO if email already exists, maybe just need to add a new asso to that account

  async function isNew(email) {
    // ouputs false if this email already got a record in database, otherwise returns back the email
    const existingFamily = await Family.findOne({ primaryEmail: email });
    // NB when there are no matches find() returns [], while findOne() returns null
    const output = !existingFamily && email;
    return output;
  }
  const results = await Promise.all(
    // (using Promise.all because array.filter doesn't support an async condition)
    goodFormatEmails.map(async email => {
      const test = await isNew(email);
      return test;
    })
  ); // ['new1@example.com', false, 'new2@example.com']
  const newEmailsArray = results.filter(email => email); // ['new1@example.com', 'new2@example.com']

  // convert array of email strings into a ready-to-insert array of objects
  const formattedArray = newEmailsArray.map(email => ({
    primaryEmail: email,
    familyId: uuid(),
    dateCreated: Date.now(),
    roles: {
      admin: [],
      parent: [selectedAsso], // parent: ['a0'],
      teacher: []
    }
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
  let insertedFamilies = await Family.insertMany(formattedArray, {
    ordered: false
  });

  // add the IDs of the newly created families to the allFamilies array in `assos` document
  let thisAsso = await Asso.findOne({ id: selectedAsso });

  const previousAllFamilies = thisAsso.allFamilies;
  const newAllFamilies = [
    ...new Set(previousAllFamilies.concat(createdFamilyIds))
  ];

  const updatedAsso = await thisAsso.set({ allFamilies: newAllFamilies });
  await updatedAsso.save();

  // TODO send email to the emails in the list,
  // and to the logged in admin who created the accounts

  const newEmails = insertedFamilies.map(thisFamily => thisFamily.primaryEmail);
  const newfamiliesByEmail = insertedFamilies.reduce(function(acc, cur) {
    acc[cur.primaryEmail] = cur;
    return acc;
  }, {});
  const duplicateEmails = emailsArray.filter(
    email => !newEmailsArray.includes(email)
  );

  console.log(
    '%s %s: NEW ACCOUNTS CREATED: %s. badFormatEmails: %s. duplicatedEmails: %s',
    req.ip,
    req.user.primaryEmail,
    newEmails.length === 0 ? 'none' : newEmails.join(', '),
    badFormatEmails.length === 0 ? 'none' : badFormatEmails.join(', '),
    duplicateEmails.length === 0 ? 'none' : duplicateEmails.join(', ')
  );

  // res.status(400).json({ error: 'Bad Request' });
  // res.status(500).json({ error: 'Internal Server Error' });

  const output = {
    newEmails,
    newfamiliesByEmail,
    badFormatEmails,
    duplicateEmails
  };

  return output;
});

var express = require('express');
var router = express.Router();

const mongoose = require('mongoose');
const Asso = mongoose.model('assos');
const Registration = mongoose.model('registrations');
const requireLogin = require('../../middlewares/requireLogin');
const requireAdmin = require('../../middlewares/requireAdmin');

router.get('/', requireLogin, requireAdmin, async function(req, res) {
  // take all the registrations from the asso document,
  // and feed the Registration with those records
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
});

module.exports = router;

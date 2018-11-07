const router = require('express').Router();
const mongoose = require('mongoose');
const Asso = mongoose.model('assos');
const Registration = mongoose.model('registrations');
const requireLogin = require('../../middlewares/requireLogin');
const requireAdmin = require('../../middlewares/requireAdmin');
const wrapAsync = require('../../utils/wrapAsync');

router.get(
  '/',
  requireLogin,
  requireAdmin,
  wrapAsync(async function(req, res) {
    // find all the registrations from the asso document,
    const assoId = 'a0';
    const thisAsso = await Asso.find({ id: assoId });

    // reformat
    a0Registrations = thisAsso[0].registrations;
    let FlatArray = Object.keys(a0Registrations)
      .map(clientId =>
        a0Registrations[clientId].map(itemId => ({ itemId, clientId }))
      )
      .reduce((output, smallArray) => output.concat(smallArray), []);

    // delete the existing Registration collection
    const outputRemove = await Registration.remove({});

    // insert back the whole Registration collection
    const output = await Registration.insertMany(FlatArray, { ordered: false });

    res.status(201).json({
      FlatArray
    });
  })
);

module.exports = router;

var express = require('express');
var router = express.Router();
const passport = require('passport');
const mongoose = require('mongoose');
const Family = mongoose.model('families');

router.get('/', async function(req, res) {
  Family.findOne(
    {
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() }
    },
    function(error, family) {
      // TODO handle error
      if (!family) {
        return res.json({ tokenIsValid: false });
      }
      return res.json({ tokenIsValid: true });
    }
  );
});

module.exports = router;

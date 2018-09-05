const mongoose = require('mongoose');
const { Schema } = mongoose;
var bcrypt = require('bcrypt-nodejs');

const familySchema = new Schema({
  // googleId: { type: String, default: '' },
  familyId: { type: String, default: '' },
  admin: { type: Boolean, default: false },
  assos: { type: Array, default: ['a0'] }, // a family can join several associations that all run this app
  allKids: { type: Array, default: [] },
  allParents: { type: Array, default: [] },
  familyMedia: {
    type: Array,
    default: [{ media: 'more_horiz', value: '', tags: ['personal'] }]
  },
  addresses: { type: Array, default: [{ value: '', tags: ['whole family'] }] },
  photoConsent: { type: Boolean, required: true, default: true },
  primaryEmail: {
    type: String,
    required: true,
    unique: true,
    match: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i
  },
  dateCreated: { type: Date, required: true, default: new Date() },
  password: { type: String },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  inputsHistory: { type: Array, default: [] },
  registeredEvents: { type: Array, default: [] },
  paymentReceipts: { type: Array, default: [] }
});

familySchema.pre('save', function(next) {
  var family = this;
  var SALT_FACTOR = 14;

  if (!family.isModified('password')) return next();

  bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
    if (err) return next(err);

    bcrypt.hash(family.password, salt, null, function(err, hash) {
      if (err) return next(err);
      family.password = hash;
      next();
    });
  });
});

familySchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

mongoose.model('families', familySchema);

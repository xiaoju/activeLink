const mongoose = require('mongoose');
const { Schema } = mongoose;
var bcrypt = require('bcrypt-nodejs');

// const userSchema = new Schema({
//   googleId: { type: String, default: '' },
//   githubId: { type: String, default: '' },
//   username: { type: String },
//   password: { type: String },
//   credits: { type: Number, default: 0 }
// });

const familySchema = new Schema({
  googleId: { type: String, default: '' },
  familyId: { type: String, default: '' },
  // photoConsent: { type: Boolean, default: false },
  assos: { type: Array, default: ['a0'] }, // a family can join several associations that all run this app
  allKids: { type: Array, default: [] },
  allParents: { type: Array, default: [] },
  familyMedia: {
    type: Array,
    default: [{ media: 'more_horiz', value: '', tags: ['private'] }]
  },
  addresses: { type: Array, default: [{ value: '', tags: ['Everybody'] }] },

  // username: { type: String, required: true, unique: true },
  primaryEmail: { type: String, required: true, unique: true },
  // email: { type: String, required: true, unique: true },
  password: { type: String },
  resetPasswordToken: String,
  resetPasswordExpires: Date,

  paymentReceipts: { type: Array, default: [] }
  // local: {
  //   email: String,
  //   password: String
  // }
  // github: {
  //   id: String,
  //   token: String,
  //   email: String,
  //   username: String
  // },
  // facebook: {
  //   id: String,
  //   token: String,
  //   email: String,
  //   name: String
  // },
  // twitter: {
  //   id: String,
  //   token: String,
  //   displayName: String,
  //   username: String
  // },
  // google: {
  //   id: String,
  //   token: String,
  //   email: String,
  //   name: String
  // }
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

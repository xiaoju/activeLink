const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcrypt');

const familySchema = new Schema({
  familyId: { type: String, default: '' },
  // admin: { type: Boolean, default: false },
  roles: { type: Object, default: { parent: ['a0'] } },
  allKids: { type: [String], default: [] },
  allParents: { type: [String], default: [] },
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

familySchema.pre('save', async function(next) {
  let family = this;
  if (!family.isModified('password')) return next();
  try {
    const saltRounds = 14;
    const hash = await bcrypt.hash(family.password, saltRounds);
    family.password = hash;
    return next();
  } catch (err) {
    return next(err);
  }
});

mongoose.model('families', familySchema);

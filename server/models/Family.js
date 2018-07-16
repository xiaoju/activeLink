const mongoose = require('mongoose');
const { Schema } = mongoose;

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
  photoConsent: { type: Boolean, default: false },
  assos: { type: Array, default: ['a0'] }, // a family can join several associations that all run this app
  allKids: { type: Array, default: [] },
  allParents: { type: Array, default: [] },
  familyMedia: {
    type: Array,
    default: [{ media: 'email', value: '', tags: ['private'] }]
  },
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

mongoose.model('families', familySchema);

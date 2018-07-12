const mongoose = require('mongoose');
const { Schema } = mongoose;

// const userSchema = new Schema({
//   googleId: { type: String, default: '' },
//   githubId: { type: String, default: '' },
//   username: { type: String },
//   password: { type: String },
//   credits: { type: Number, default: 0 }
// });

const userSchema = new Schema({
  // credits: { type: Number, default: 0 },
  googleId: { type: String, default: '' },
  familyId: { type: String, default: '' },
  allKids: { type: Array, default: ['k0'] },
  allParents: { type: Array, default: ['p0'] },
  familyMedia: {
    type: Array,
    default: [{ media: 'email', value: '', tags: ['private'] }]
  },
  bookedEvents: { type: Array, default: [] },
  allRegistered: { type: Array, default: [] },
  registeredPerId: { type: Object, default: {} },
  paymentReceipts: { type: Array, default: [] },
  familyPerId: {
    type: Object,
    default: {
      p0: {
        id: 'p0',
        firstName: '',
        familyName: ''
      },
      k0: {
        id: 'k0',
        firstName: '',
        familyName: '',
        kidGrade: ' '
      }
    }
  }
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

mongoose.model('users', userSchema);

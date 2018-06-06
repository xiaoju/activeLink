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
  credits: { type: Number, default: 0 },
  local: {
    email: String,
    password: String
  },
  github: {
    id: String,
    token: String,
    email: String,
    username: String
  }
});
// ,
//   facebook: {
//     id: String,
//     token: String,
//     email: String,
//     name: String
//   },
//   twitter: {
//     id: String,
//     token: String,
//     displayName: String,
//     username: String
//   },
//   google: {
//     id: String,
//     token: String,
//     email: String,
//     name: String
//   }
// });

mongoose.model('users', userSchema);

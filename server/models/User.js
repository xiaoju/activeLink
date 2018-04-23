const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  googleId: { type: String, default: '' },
  githubId: { type: String, default: '' },
  username: { type: String },
  password: { type: String },
  credits: { type: Number, default: 0 }
});

mongoose.model('users', userSchema);

const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  id: { type: String },
  firstName: { type: String },
  familyName: { type: String },
  kidGrade: { type: String }
});

mongoose.model('users', userSchema);

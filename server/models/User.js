const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  id: { type: String },
  firstName: { type: String },
  familyName: { type: String },
  kidGrade: { type: String },
  family: { type: [String] }, // kids and parents might belong to several families ("familles recomposées")
  deleted: { type: Boolean }
});

mongoose.model('users', userSchema);

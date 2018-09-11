const mongoose = require('mongoose');
const { Schema } = mongoose;

const registrationSchema = new Schema({
  clientId: { type: String },
  itemId: { type: String }
});

mongoose.model('registrations', registrationSchema);

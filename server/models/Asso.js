const mongoose = require('mongoose');
const { Schema } = mongoose;

const assoSchema = new Schema({
  id: { type: String, default: '' },
  assoEmail: { type: String, default: '' },
  replyTo: { type: String, default: '' },
  emailFrom: { type: String, default: '' },
  backupEmail: { type: String, default: '' },
  name: { type: String, default: '' },
  website: { type: String, default: '' },
  contacts: { type: Array, default: [] },
  address: { type: String, default: '' },
  allStaff: { type: [String], default: [] },
  staffById: { type: Object, default: {} },
  allItems: { type: [String], default: [] },
  itemsById: { type: Object, default: {} },
  allFamilies: { type: [String], default: [] },
  registrations: { type: Object, default: {} },
  eventsById: { type: Object, default: {} },

  assoEvents: { type: [String], default: [] }

  // currentRegistrationEvents: { type: Array, default: [] },
  // pastRegistrationEvents: { type: Array, default: [] },
  // futureRegistrationEvents: { type: Array, default: [] }
});

mongoose.model('assos', assoSchema);

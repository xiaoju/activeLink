const mongoose = require('mongoose');
const { Schema } = mongoose;

const assoSchema = new Schema({
  id: { type: String, default: '' },
  name: { type: String, default: '' },
  contacts: { type: Array, default: [''] },
  adress: { type: String, default: '' },
  allStaff: { type: Array, default: [''] },
  staffById: { type: Object, default: {} },
  allItems: { type: Array, default: [''] },
  itemsById: { type: Object, default: {} },
  allEvents: { type: Array, default: [''] },
  eventsById: { type: Object, default: {} },
  allFamilies: { type: Array, default: [''] },
  registrations: { type: Object, default: {} }
});

mongoose.model('assos', assoSchema);

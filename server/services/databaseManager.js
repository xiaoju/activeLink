const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const keys = require('../config/keys');

require('../models/Asso');
require('../models/Family');
require('../models/User');
require('../models/Registration');

const MongooseOptions = {
  // useMongoClient: true, // TODO do I need this option?
  useNewUrlParser: true,
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 1000
};

mongoose
  .connect(keys.mongoURI, MongooseOptions)
  .then(res =>
    console.log('______________ mongoose: connection success ______________ \n')
  )
  .catch(err => {
    console.log(
      '_-_-_-_-_-_-_ Mongoose connect error: _-_-_-_-_-_-_-_\n',
      err,
      '\n_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_\n'
    );
    // res.status(500).json({ error: err.toString() });
    // maybe set env variable that connect to db is dead, then use middleware to answer to any request "no connection come back later"
    // TODO in line above, (when no connection to database,
    // res is undefined, and this error isn't caught.
  });
// .then(
//   () => {
//     console.log('mongoose: connection success.');
//     /** ready to use. The `mongoose.connect()` promise resolves to undefined. */
//   },
//   err => {
//     console.log('______________ Mongoose connect error: __________', err);
//   }
// );

mongoose.connection.on('disconnected', () => {
  console.log('-> database lost connection');
});
mongoose.connection.on('connected', () => {
  console.log('-> database connected');
});
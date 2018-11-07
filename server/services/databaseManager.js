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

// TODO handle fast the lost connections to db

mongoose
  .connect(keys.mongoURI, MongooseOptions)
  .then(res =>
    console.log(
      '____________ mongoose initial connection: success ____________ \n'
    )
  )
  .catch(err => {
    console.log(
      '_-_-_-_-_-_-_ Mongoose initial connection error: _-_-_-_-_-_-_-_\n',
      err,
      '\n_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_\n'
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
  // TODO should I throw a 503 error? Or store the request (where?!) and handle it later?
  console.log('-> database lost connection');
  // throw 'oops';
});

mongoose.connection.on('connected', () => {
  console.log('-> database connected');
});

mongoose.connection.on('error', err => {
  console.log('Mongoose connection error:', err);
});

// process.on('SIGINT', function() {
//  //  mongoose.connection.close(function() {
//     mongoose.disconnect() {
//     console.log(
//       'Mongoose default connection was disconnected due to application termination'
//     );
//     //  process.exit(0);
//     process.exitCode = 0;
//   });
// });

// mongoose.connection.once('open', function() {
//   // we're connected!
// });

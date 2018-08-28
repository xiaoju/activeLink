const express = require('express');

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const cookieSession = require('cookie-session');

const passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
// var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');

const bodyParser = require('body-parser');
const keys = require('./config/keys');
require('./models/Asso');
require('./models/Family');
require('./models/User');
require('./services/passport');

mongoose
  .connect(keys.mongoURI, {
    useNewUrlParser: true,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 1000
  })
  .then(res => console.log('mongoose: connection success.'))
  .catch(err =>
    console.log('______________ Mongoose connect error: __________', err)
  );
// .then(
//   () => {
//     console.log('mongoose: connection success.');
//     /** ready to use. The `mongoose.connect()` promise resolves to undefined. */
//   },
//   err => {
//     console.log('______________ Mongoose connect error: __________', err);
//   }
// );

const app = express();

app.use(bodyParser.json());

// app.use(express.json());
// see https://stackoverflow.com/questions/10005939/how-do-i-consume-the-json-post-data-in-an-express-application

app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
  })
);

app.use(passport.initialize());
app.use(passport.session());

require('./routes/authRoutes')(app);
// require('./routes/googleAuthRoutes')(app);
require('./routes/billingRoutes')(app);
require('./routes/adminRoutes')(app);

if (process.env.NODE_ENV === 'production') {
  // Express will serve up production assets
  // if it doesn't recognize the routes
  app.use(express.static('client/build'));

  // Express will serve up the index.html file
  // if it doesn't recognize the routes
  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT);

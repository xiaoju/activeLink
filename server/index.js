const express = require('express');
const sslRedirect = require('heroku-ssl-redirect');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const keys = require('./config/keys');

require('./services/databaseManager');
require('./services/passport');

const app = express();
app.use(sslRedirect());
app.use(bodyParser.json());
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use('/', require('./routes'));

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

app.use(require('./middlewares/errorHandler_Logger'));
app.use(require('./middlewares/errorHandler_Final'));

const PORT = process.env.PORT || 5000;
app.listen(PORT);

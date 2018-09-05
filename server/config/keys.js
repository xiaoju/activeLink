if (process.env.NODE_ENV === 'production') {
  module.exports = require('./prod'); // for 'production' and 'staging' environments
} else {
  module.exports = require('./dev');
}

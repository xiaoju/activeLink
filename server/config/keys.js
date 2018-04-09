console.log('this is server/config/keys.js');
if (process.env.NODE_ENV === 'production') {
  console.log('keys.js: I am prod');
  module.exports = require('./prod');
} else {
  console.log('keys.js: I am dev');
  module.exports = require('./dev');
}

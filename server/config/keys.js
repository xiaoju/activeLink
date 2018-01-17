if (process.env.NODE_ENV === 'production') {
  console.log('i am prod');
  module.exports = require('./prod');
} else {
  module.exports = require('./dev');
}

const AppError = require('./AppError');

class NotLoggedIn extends AppError {
  constructor(message) {
    super(message || 'Not logged in', 401);
    this.name = 'NotLoggedIn';
  }
}

module.exports = NotLoggedIn;

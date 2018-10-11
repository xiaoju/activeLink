const AppError = require('./AppError');

class UserNotFound extends AppError {
  constructor(message) {
    super(message || 'User not found.', 404);
    this.name = 'authError';
    // this.name = this.constructor.name;
  }
}

module.exports = UserNotFound;

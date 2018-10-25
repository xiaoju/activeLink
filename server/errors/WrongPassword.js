const AppError = require('./AppError');

class WrongPassword extends AppError {
  constructor(message) {
    super(message || 'WRONG PWD', 401);
    this.name = 'WrongPassword';
  }
}

module.exports = WrongPassword;

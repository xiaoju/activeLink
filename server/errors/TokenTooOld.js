const AppError = require('./AppError');

class TokenTooOld extends AppError {
  constructor(message) {
    super(message || 'ResetPasswordToken too old.', 404);
    this.name = 'invalidToken';
  }
}

module.exports = TokenTooOld;

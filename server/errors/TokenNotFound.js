const AppError = require('./AppError');

class TokenNotFound extends AppError {
  constructor(message) {
    super(message || 'ResetPasswordToken not found.', 404);
    this.name = 'invalidToken';
  }
}

module.exports = TokenNotFound;

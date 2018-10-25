const AppError = require('./AppError');

class FoundNoAccount extends AppError {
  constructor(message) {
    super(message || 'Found no account with this email.', 401);
    this.name = 'FoundNoAccount';
  }
}

module.exports = FoundNoAccount;

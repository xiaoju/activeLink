const AppError = require('./AppError');

class InvalidInput extends AppError {
  constructor(message) {
    super(message || 'Invalid input.', 400);
    this.name = 'invalidInput';
  }
}

module.exports = InvalidInput;

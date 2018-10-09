const AppError = require('./AppError');

class OrderNotFoundError extends AppError {
  constructor(message) {
    super(message || 'No Order found with that id.', 404);
  }
}

module.exports = OrderNotFoundError;

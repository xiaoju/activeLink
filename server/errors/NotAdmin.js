const AppError = require('./AppError');

class NotAdmin extends AppError {
  constructor(message) {
    super(message || 'Requires admin credentials', 403);
    this.name = 'NotAdmin';
  }
}

module.exports = NotAdmin;

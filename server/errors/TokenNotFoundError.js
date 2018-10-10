const AppError = require('./AppError');

class TokenNotFoundError extends AppError {
  constructor(message) {
    super(message || 'passwordResetToken not found.', 401);

    // TODO code to log this failed user:
    // just logging who got problems
    // let failed;
    // try {
    //   failed = await Family.findOne({
    //     resetPasswordToken: req.params.token
    //   });
    // } catch (err) {
    //   console.log('FAILED database lookup 2 by checkResetToken ROUTE');
    //   // but still sending status code 401 to client
    // }
    // if (!failed) {
    //   console.log(
    //     req.ip,
    //     ', ',
    //     req.user && req.user.primaryEmail,
    //     ': FAILED TOKEN CHECK (token not found)'
    //   );
    // } else {
    //   console.log(
    //     req.ip,
    //     ', ',
    //     failed.primaryEmail,
    //     ': FAILED TOKEN CHECK (token too old)'
    //   );
    // }
    // end of 'logging who got problems'
  }
}

module.exports = TokenNotFoundError;

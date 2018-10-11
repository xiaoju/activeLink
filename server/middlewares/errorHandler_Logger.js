module.exports = (err, req, res, next) => {
  console.error(
    req.ip,
    req.body.primaryEmail,
    err.status,
    err.privateBackendMessage,
    err.stack
  );
  // console.error('ERROR.NAME: ', err.name);
  // MongoNetworkError: cannot connect to database
  // MongoError: something wrong with the query, e.g. Family.find({ Date: { $last: 'Date' } });

  next(err);
};

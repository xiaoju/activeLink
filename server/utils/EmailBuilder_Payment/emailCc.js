module.exports = thisAsso =>
  process.env.NODE_ENV === 'production' ? thisAsso.backupEmail : undefined;

const oEnvironment = require('../constants/Environment.js');
const AuthMiddleware = require('../middleware/AuthMiddleware.js');

module.exports = function (oApp) {
  // Routes with authentication
  oApp.use(`${oEnvironment.URL_API}admin`, AuthMiddleware, require('./Users'));

  // Routes without authentication
  oApp.use(`${oEnvironment.URL_API}admin`, require('./Users'));
};
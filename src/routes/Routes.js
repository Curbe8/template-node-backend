const oEnvironment = require('../constants/Environment.js');
const AuthMiddleware = require('../middleware/AuthMiddleware.js');

module.exports = function (oApp) {
    // Middleware de autenticacion por token
    oApp.use(AuthMiddleware);
    oApp.use(`${oEnvironment.URL_API}admin`, require('./Users'));
};
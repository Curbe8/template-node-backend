const oEnvironment = require('../constants/Environment.js');
const { PERMISSIONS } = require('../constants/StatusCode.js');
const UserController = require('../controllers/UserController.js');
const Controller = new UserController();

module.exports = function (oApp) {
    // Middleware de autenticacion por token
    oApp.use((oRequest, oResponse, oNext) => {
        let sPath = oRequest.path;
        console.log('ACA!', sPath);
        if (!(sPath.includes('admin/login') || sPath.includes('admin/logout')|| sPath.includes('download'))) {
            let sToken = oRequest.headers.authorization;
            try {
                if (sToken)
                    Controller.findByToken(sToken, (oUser = null, bIsError = false) => {
                        if (!bIsError && oUser) {
                            oRequest.oUser = oUser;
                            console.log('ACA!');
                            oNext();
                        } else
                            Controller.respond(oResponse, PERMISSIONS, { message: 'No autorizado' })
                    });
                else
                    Controller.respond(oResponse, PERMISSIONS, { message: 'No autorizado' })
            } catch (oException) {
                Controller.respond(oResponse, PERMISSIONS, null, oException);
            }
        } else
            oNext();
    });
    oApp.use(`${oEnvironment.URL_API}admin`, require('./Users'));
};
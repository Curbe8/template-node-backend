const { PERMISSIONS } = require('../constants/StatusCode.js');
const UserController = require('../controllers/UserController.js');
const Controller = new UserController();

module.exports = AuthMiddleware = (oRequest, oResponse, oNext) => {
    let sPath = oRequest.path;
    if (!(sPath.includes('admin/login') || sPath.includes('admin/logout') || sPath.includes('admin/token') || sPath.includes('download'))) {
        let sToken = oRequest.headers.authorization;
        try {
            if (sToken)
                Controller.findByToken(sToken, (oUser = null, bIsError = false) => {
                    if (!bIsError && oUser) {
                        oRequest.oUser = oUser;
                        oNext();
                    } else
                        Controller.respond(oResponse, PERMISSIONS);
                });
            else
                Controller.respond(oResponse, PERMISSIONS);
        } catch (oException) {
            Controller.respond(oResponse, PERMISSIONS, null, oException);
        }
    } else
        oNext();
}
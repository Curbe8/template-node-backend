const { DONE, CONFLICT, NOT_VALID, NOT_FOUND } = require('../constants/StatusCode');
const bcryptjs = require('bcryptjs');
const User = require('../models/User');
const Controller = require('../controllers/Controller');
const TokenGenerator = require('uuid-token-generator');
const { BASE16 } = require('uuid-token-generator');
const oTokenGenerator = new TokenGenerator(256, BASE16);
/**
 * Principal modelo a ser usado por el controlador
 */
const Model = new User();
/**
 * Controlador que controla los datos y la sesion del usuario.
 */
var UserController = class UserController extends Controller {

    constructor() {
        super();
    }

    /**
     * Función de login, se toman los datos del usuario, se comprueba que los mismos sean correctos y se genera una nueva api token.
     * 
     * @param {Request} oRequest Request de la peticion, aqui se reciben las credenciales del usuario
     * @param {Response} oResponse Este objeto maneja el response de la solicitud
     * 
     * @author Leandro Curbelo
     */
     login = async (oRequest, oResponse) => {
        try {
            let sEmail = oRequest.body.email, sPassword = oRequest.body.password;
            if (!sEmail || !sPassword)
                return this.respond(oResponse, NOT_VALID, { message: 'Se necesitan credenciales válidas' });
            Model.getByEmail(sEmail, async (oUser, bIsError = false) => {
                if (bIsError)
                    return this.respond(oResponse, CONFLICT, null, oUser);
                if (!oUser || !(await bcryptjs.compare(sPassword, oUser.password)))
                    return this.respond(oResponse, NOT_FOUND, { message: 'Credenciales incorrectas' });
                let sToken = oTokenGenerator.generate();
                Model.updateToken(sEmail, sToken, (sMessageError = null) => {
                    if (sMessageError)
                        return this.respond(oResponse, CONFLICT, null, sMessageError);
                    oUser.remember_token = sToken;
                    delete oUser.password;
                    this.respond(oResponse, DONE, { message: 'Login correcto', data: oUser });
                });
            });
        } catch (oException) {
            return this.handleError(oResponse, oException);
        }
    }
    /**
     * Función de login, se toman los datos del usuario, se comprueba que los mismos sean correctos y se genera una nueva api token.
     * 
     * @param {Request} oRequest Request de la peticion, aqui se reciben las credenciales del usuario
     * @param {Response} oResponse Este objeto maneja el response de la solicitud
     * 
     * @author Leandro Curbelo
     */
    logout = async (oRequest, oResponse) => {
        try {
            let sToken = oRequest.headers.authorization;
            if (!sToken)
                return this.respond(oResponse, NOT_VALID, { message: 'No autorizado' })
            this.findByToken(sToken, (oUser = null, bIsError = false) => {
                if (bIsError || !oUser)
                    return this.respond(oResponse, DONE, { message: 'Autenticación no valida' });
                Model.updateToken(oUser.email, null, (sMessageError = null) => {
                    this.respond(oResponse, DONE, { message: 'El usuario cerro sesión correctamente' });
                });
            });
        } catch (oException) {
            return this.handleError(oResponse, oException);
        }
    }
    /**
     * Función de logout, se obtiene el usuario y se eliminan las credenciales de acceso al sistema
     * 
     * @param {Request} oRequest Request de la peticion, aqui se reciben las credenciales del usuario
     * @param {Response} oResponse Este objeto maneja el response de la solicitud
     * 
     * @author Leandro Curbelo
     */
    checkToken = (oRequest, oResponse) => {
        try {
            if (!oRequest.oUser)
                return this.respond(oResponse, NOT_VALID, { message: 'Autenticación no valida' });
            this.findByToken(oRequest.oUser.remember_token, (oUser = null, bIsError = false) => {
                if (bIsError || oUser)
                    return this.respond(oResponse, NOT_VALID, { message: 'Autenticación no valida', debug: oRequest.oUser });
                let sToken = oTokenGenerator.generate();
                Model.updateToken(oRequest.oUser.email, sToken, (sMessageError = null) => {
                    if (!sMessageError)
                        return this.respond(oResponse, CONFLICT, null, sMessageError);
                    oUser.remember_token = sToken;
                    delete oUser.password;
                    return this.respond(oResponse, DONE, { message: 'Token actualizado', data: oUser });
                });
            });
        } catch (oException) {
            return this.handleError(oResponse, oException);
        }
    }
    /**
     * Función encargada de buscar mediante el modelo al usuario en base a su token
     * 
     * @author Leandro Curbelo
     */
    findByToken = (sToken, fCallBack) => {
        Model.getByToken(sToken, fCallBack);
    }
}

/*
    ! COMENTARIO DE AYUDA - Fragmento de codigo que genera clave
    bcryptjs.genSalt(10, (err, salt)  => {
        bcryptjs.hash('123', salt, (err, hash) =>  {
            this.respond(oResponse, DONE, hash);
            
        });
    });
    return;
 */

module.exports = UserController;
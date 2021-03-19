const { DONE, CONFLICT, NOT_VALID, NOT_FOUND, PERMISSIONS } = require('../constants/StatusCode');
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
     * Funcion de login, se toman los datos del usuario, se comprueba que los mismos sean correctos y se genera una nueva api token.
     * 
     * @param {Request} oRequest Request de la peticion, aqui se reciben las credenciales del usuario
     * @param {Response} oResponse Este objeto maneja el response de la solicitud
     * 
     * @author Leandro Curbelo
     */
    login = async (oRequest, oResponse) => {
        try {
            let sEmail = oRequest.body.email, sPassword = oRequest.body.password;
            if (sEmail && sPassword) {
                Model.getByEmail(sEmail, async (oUser, bIsError = false) => {
                    if (!bIsError) {
                        if (oUser) {
                            if (await bcryptjs.compare(sPassword, oUser.password)) {
                                let sToken = oTokenGenerator.generate();
                                Model.updateToken(sEmail, sToken, (sMessageError = null) => {
                                    if (sMessageError == null) {
                                        oUser.remember_token = sToken;
                                        delete oUser.password;
                                        this.respond(oResponse, DONE, { message: 'Login correcto', data: oUser });
                                    } else {
                                        this.respond(oResponse, CONFLICT, null, sMessageError);
                                    }
                                });
                            } else
                                this.respond(oResponse, NOT_VALID, { message: 'Contraseña incorrecta' });
                        } else
                            this.respond(oResponse, NOT_FOUND, { message: 'Email incorrecto' });
                    } else
                        this.respond(oResponse, CONFLICT, null, oUser);
                });
            } else
                this.respond(oResponse, NOT_VALID, { message: 'Se necesitan credenciales válidas' });
        } catch (oException) {
            this.respond(oResponse, CONFLICT, null, oException.message);
        }
    }
    /**
     * Funcion de login, se toman los datos del usuario, se comprueba que los mismos sean correctos y se genera una nueva api token.
     * 
     * @param {Request} oRequest Request de la peticion, aqui se reciben las credenciales del usuario
     * @param {Response} oResponse Este objeto maneja el response de la solicitud
     * 
     * @author Leandro Curbelo
     */
    logout = async (oRequest, oResponse) => {
        try {
            let sToken = oRequest.headers.authorization;
            if (sToken)
                this.findByToken(sToken, (oUser = null, bIsError = false) => {
                    if (!bIsError && oUser)
                        Model.updateToken(oUser.email, null, (sMessageError = null) => {
                            this.respond(oResponse, DONE, { message: 'El usuario cerro sesión correctamente' });
                        })
                    else
                        this.respond(oResponse, DONE, { message: 'Autenticación no valida' });
                });
            else
                this.respond(oResponse, NOT_VALID, { message: 'No autorizado' })
        } catch (oException) {
            this.respond(oResponse, CONFLICT, null, oException.message);
        }
    }
    /**
     * Funcion encargada de chequear que el token de usuario este vigente, si lo esta actualiza el token y retorna el usuario
     * 
     * @param {Request} oRequest Request de la peticion, aqui se reciben las credenciales del usuario
     * @param {Response} oResponse Este objeto maneja el response de la solicitud
     * 
     * @author Leandro Curbelo
     */
    checkToken = (oRequest, oResponse) => {
        try {
            if (oRequest.oUser) {
                this.findByToken(oRequest.oUser.remember_token, (oUser = null, bIsError = false) => {
                    if (!bIsError && oUser) {
                        let sToken = oTokenGenerator.generate();
                        Model.updateToken(oRequest.oUser.email, sToken, (sMessageError = null) => {
                            if (sMessageError == null) {
                                oUser.remember_token = sToken;
                                delete oUser.password;
                                this.respond(oResponse, DONE, { message: 'Token actualizado', data: oUser });
                            } else {
                                this.respond(oResponse, CONFLICT, null, sMessageError);
                            }
                        });
                    } else
                        this.respond(oResponse, NOT_VALID, { message: 'Autenticación no valida', debug: oRequest.oUser });
                });
            } else
                this.respond(oResponse, NOT_VALID, { message: 'Autenticación no valida' });
        } catch (oException) {
            this.respond(oResponse, CONFLICT, null, oException.message);
        }
    }
    /**
     * Funcion encargada de buscar mediante el modelo al usuario en base a su token
     * 
     * @author Leandro Curbelo
     */
    findByToken = (sToken, fCallBack) => {
        Model.getByToken(sToken, fCallBack);
    }
}

/*
    ! COMENTARIO PARA ELIMINAR - Fragmento de codigo que genera clave
    bcryptjs.genSalt(10, (err, salt)  => {
        bcryptjs.hash('123', salt, (err, hash) =>  {
            this.respond(oResponse, DONE, hash);
            
        });
    });
    return;
 */

module.exports = UserController;
const Model = require('./Model');

const TABLE_NAME = 'users';
const DELETE_SENTENCE = 'AND deleted_at IS NULL';
const MINIMAL_COLUMNS = 'id, name, lastname, email, password, remember_token';

var User = class User extends Model {

    constructor() {
        super(TABLE_NAME, DELETE_SENTENCE, MINIMAL_COLUMNS);
    }
    /**
     * Funcion que busca un usuario teniendo en cuenta el email que recibe por parametro.
     * 
     * @param {string} sEmail Email por el que se desea filtrar al usuario
     * @param {function} fCallBack Funcion que realiza el callback luego de procesar la busqueda del usuario
     * 
     * @return {User | string}
     * 
     * @author Leandro Curbelo
     */
    getByEmail = async (sEmail, fCallBack) => {
        try {
            let sSql = `SELECT ${MINIMAL_COLUMNS} FROM ${TABLE_NAME} WHERE email = ${this.oConnection.escape(sEmail)} ${DELETE_SENTENCE}`;
            this.oConnection.query(sSql, (oError, oResult) => {
                if (oError)
                    fCallBack(oError.message, true);
                else
                    fCallBack(oResult[0]);
            });
        } catch (oError) {
            fCallBack(oError.message, true);
        }
    }
    /**
     * Funcion que busca un registro de usuario teniendo en cuenta el token de autenticacion
     * 
     * @param {string} sToken Token por el cual se buscara al usuario
     * @param {function} fCallBack Funcion que realiza el callback luego de procesar la busqueda del usuario
     * 
     * @return {User | string}
     * 
     * @author Leandro Curbelo
     */
    getByToken = async (sToken, fCallBack) => {
        try {
            let sSql = `SELECT ${MINIMAL_COLUMNS} FROM ${TABLE_NAME} WHERE remember_token = ${this.oConnection.escape(sToken)} ${DELETE_SENTENCE}`;
            this.oConnection.query(sSql, (oError, oResult) => {
                if (oError)
                    fCallBack(oError.message, true);
                else
                    fCallBack(oResult[0]);
            });
        } catch (oError) {
            fCallBack(oError.message, true);
        }
    }
    /**
     * Funcion que actualiza el token de un usaurio con el email sEmail.
     * 
     * @param {string} sEmail Email del usuario al que se quiere modificar
     * @param {string} sToken Token de autenticacion que sera actualizado
     * @param {function} fCallBack Funcion a la cual se llamara una ves de terminar el proceso
     * 
     * @author Leandro Curbelo
     */
    updateToken = (sEmail, sToken, fCallBack) => {
        try {
            let sSql = `UPDATE ${TABLE_NAME} SET remember_token = ${this.oConnection.escape(sToken)} WHERE email = ${this.oConnection.escape(sEmail)}`;
            this.oConnection.query(sSql, (oError, oResult) => {
                if (oError)
                    fCallBack(oError.message);
                else
                    fCallBack();
            });
        } catch (oError) {
            fCallBack(oError.message, true);
        }
    }
}

module.exports = User;
const oEnvironment = require('../constants/Environment.js');
var oMySQL = require('mysql');
/**
 * Modelo principal el cual extenderan los demas modelos y contendra funciones en comun.
 */
var Model = class Model {

    constructor(sTable, sDeleteSentence = '', sMinimalColumns = '*') {
        this.sTable = sTable;
        this.sDeleteSentence = sDeleteSentence;
        this.sMinimalColumns = sMinimalColumns;
        this.getConnection();
    }
    /**
     * Funcion principal para tomar e instanciar de forma singleton la conexion a la base de datos.
     * 
     * @author Leandro Curbelo
     */
    getConnection = () => {
        if (!this.oConnection) {
            this.oConnection = oMySQL.createConnection({
                host: oEnvironment.DB_HOST,
                user: oEnvironment.DB_USER,
                password: oEnvironment.DB_PASSWORD,
                database: oEnvironment.DB_NAME,
                port: oEnvironment.DB_PORT,
                charset: oEnvironment.DB_CHARSET,
            });
        }
        this.oConnection.config.queryFormat = function (oQuery, oValues) {
            if (!oValues) return oQuery;
            return oQuery.replace(/\:(\w+)/g, function (sTxt, sKey) {
                if (oValues.hasOwnProperty(sKey)) {
                    let sValue = oValues[sKey] !== '' ? oValues[sKey] : null;
                    return this.escape(sValue);
                }
                return sTxt;
            }.bind(this));
        };
    }
    /**
     * Funcion común para todos los modelos, retorna todos los registros de la tabla.
     * 
     * @param {function} fCallBack Funcion que sera llamada como callback, debe recibir un oResult y un bIsError (oResult, bIsError = false)
     * 
     * @author Leandro Curbelo
     */
    getAll = (fCallBack) => {
        this.oConnection.query(`SELECT ${this.sMinimalColumns} FROM ${this.sTable} WHERE 1 ${this.sDeleteSentence} ORDER BY name`, (oError, oResult) => {
            if (oError)
                fCallBack(oError, true);
            else
                fCallBack(oResult);
        });
    }
    /**
     * Funcion común para todos los modelos, busca un registro por el identificador primario de la tabla.
     * 
     * @param {number} nId Identificador primario del registro
     * @param {function} fCallBack Funcion que sera llamada como callback, debe recibir un oResult y un bIsError (oResult, bIsError = false)
     * 
     * @author Leandro Curbelo
     */
    find = (nId, fCallBack) => {
        this.oConnection.query(`SELECT ${this.sMinimalColumns} FROM ${this.sTable} WHERE id = ${this.oConnection.escape(nId)} ${this.sDeleteSentence}`, (oError, oResult) => {
            if (oError)
                fCallBack(oError, true);
            else
                fCallBack(oResult[0]);
        });
    }
    /**
     * Funcion que remueve un registro de la base de la tabla instagram
     * 
     * @param {number} nId Identificador tomado de instagram
     * @param {Date} dNow Fecha del momento en que el registro se elimina
     * @param {function} fCallBack Funcion que sera llamada como callback, debe recibir un oResult y un bIsError (oResult, bIsError = false)
     * 
     * @author Leandro Curbelo
     */
    remove = (nId, dNow, fCallBack) => {
        this.oConnection.query(`UPDATE ${this.sTable} SET deleted_at = ${this.oConnection.escape(dNow)} WHERE id = ${this.oConnection.escape(nId)}`, (oError, oResult) => {
            if (oError)
                fCallBack(oError, true);
            else
                fCallBack(oResult[0]);
        });
    }
}

module.exports = Model;
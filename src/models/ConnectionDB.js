const oEnvironment = require('../constants/Environment.js');
const oMySQL = require('mysql');

/**
 * Singleton encargado de manejar una unica conexion a la base de datos, de este modo se pueden
 *  manejar transacciones sobre MySQL con inserciones en diferentes modelos de datos.
 */
class ConnectionDB {
    /**
     * En el costructor se genera la conexion a la base de datos si aun no se ah creado y se
     *  realiza la configuracion pertinente
     */
    constructor() {
        if (!ConnectionDB.oConnection) {
            ConnectionDB.oConnection = oMySQL.createConnection({
                host: oEnvironment.DB_HOST,
                user: oEnvironment.DB_USER,
                password: oEnvironment.DB_PASSWORD,
                database: oEnvironment.DB_NAME,
                port: oEnvironment.DB_PORT,
                charset: oEnvironment.DB_CHARSET,
                timezone: oEnvironment.DB_UTC,
            });
            ConnectionDB.oConnection.config.queryFormat = function (oQuery, oValues) {
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
    }
    /**
     * Esta funcion retorna la instancia de la conexion a la base de datos.
     * 
     * @returns {oMySQL.ConnectionConfig}
     * 
     * @author Leandro Curbelo
     */
    getInstance = () => {
        return ConnectionDB.oConnection;
    }
}

module.exports = ConnectionDB;
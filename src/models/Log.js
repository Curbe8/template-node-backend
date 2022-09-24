const Model = require('./Model');

const TABLE_NAME = 'logs';
/**
 * Modelo que maneja el control de errores
 */
var Log = class Log extends Model {

  constructor() {
    super(TABLE_NAME);
  }
  /**
   * Función que inserta un nuevo registro de log.
   * 
   * @param {number} nType Tipo de registro, indica cual pagina se intentaba scrapear
   * @param {string} sMessage Mensaje que brinda informacion del lugar donde surguio el problema
   * @param {object} oException Objeto error
   * @param {string} sArchive Nombre del archivo en el cual surge el problema
   * @param {string} sFunction Nombre de la función donde se obtiene el problema
   * 
   * @author Leandro Curbelo
   */
  save = (nType, sMessage, oException = null, sArchive = null, sFunction = null) => {
    var sSql = `INSERT INTO ${this.sTable} (
        type,
        message,
        error,
        archive,
        function
      ) VALUES (
        ${this.oConnection.escape(nType)},
        ${this.oConnection.escape(sMessage)},
        ${this.oConnection.escape(oException !== null ? JSON.stringify(oException) : null)},
        ${this.oConnection.escape(sArchive)},
        ${this.oConnection.escape(sFunction)}
      )`;
    this.oConnection.query(sSql, (oError, oResult) => { });
  }
}

module.exports = Log;
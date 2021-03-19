const oEnvironment = require('../constants/Environment.js');
const { NOT_FOUND } = require('../constants/StatusCode.js');
const Log = require('../models/Log');

const LogModel = new Log();

var Controller = class Controller {

    constructor() { }
    /**
     * Funcion que retorna la respuesta.
     * 
     * @param {Response} oResponse Este objeto maneja el response de la solicitud.
     * @param {number} nStatusCode Codigo de estado de la solicud.
     * @param {Array} oData Arreglo de datos que seran devueltos en la solicitud.
     * @param {string | object} oException Mensaje de error o objeto error si lo hay.
     * 
     * @author Leandro Curbelo
     */
    respond = (oResponse, nStatusCode, oData = null, oException = null) => {
        oResponse.status(nStatusCode);
        if (oData == null)
            if (nStatusCode == NOT_FOUND)
                oData = { message: oEnvironment.GENERAL_MESSAGE_NOT_FOUND };
            else
                oData = { message: oEnvironment.GENERAL_MESSAGE_ERROR };
        if (oEnvironment.DEBUG && oException !== null)
            oData['debug'] = oException;
        oResponse.json(oData);
    }
    /**
     * Funcion que retorna la ruta del archivo dependiendo del tipo de archivo que se recibe.
     * 
     * @param {number} nType Representa el tipo de archivo que sera descargado
     * @param {Response} oResponse Este objeto maneja el response de la solicitud.
     * 
     * @author Leandro Curbelo
     */
    download = (nType, oResponse) => {
        nType = +nType;
        let sPath = '';
        try {
            switch (nType) {
                case 1:
                    sPath = `${__dirname}/../../public/exports/test.xlsx`;
                    oResponse.download(sPath, 'Test.xlsx');
                    break;
                default:
                    this.respond(oResponse, CONFLICT, { message: 'Método no implementado' });
                    break;
            }
        } catch (oException) {
            LogModel.save(nType, 'Problema con la descarga del archivo', oException, 'Controller.js', 'download');
            this.respond(oResponse, CONFLICT, null, oException);
        }
    }
}

module.exports = Controller;
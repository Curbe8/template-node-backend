// El siguiente codigo carga las variables alojadas en archivo .env
const oDotEnv = require('dotenv');
oDotEnv.config();
// Asigna el archivo .env a una constante para su mejor manipulacion
const oEnviroment = process.env;
/**
 * Archivo de constantes de configuracion del proyecto
 */
module.exports = {
    URL_API: '/',
    URL_PUBLIC: oEnviroment.URL_PUBLIC,
    DEBUG: oEnviroment.DEBUG,
    PORT: oEnviroment.PORT,

    PLATFORM_NAME: oEnviroment.PLATFORM_NAME,

    DB_NAME: oEnviroment.DB_NAME,
    DB_USER: oEnviroment.DB_USER,
    DB_PASSWORD: oEnviroment.DB_PASSWORD,
    DB_HOST: oEnviroment.DB_HOST,
    DB_PORT: oEnviroment.DB_PORT,
    DB_CHARSET: oEnviroment.DB_CHARSET,
    DB_UTC: oEnviroment.DB_UTC,

    GENERAL_MESSAGE_ERROR: 'Ah ocurrido un error, por favor intente de nuevo más tarde.',
    GENERAL_MESSAGE_NOT_FOUND: 'No se encontro registro con ese identificador',
    GENERAL_MESSAGE_NOT_VALID: 'Parámetros no válidos',
    GENERAL_MESSAGE_UNAUTHORIZED: 'Unauthorized',
};

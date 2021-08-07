const DEBUG_MODE = true;
const LOCAL_ENVIRONMENT = true;
/**
 * Archivo de constantes de configuracion del proyecto
 */
module.exports = {
    URL_API: '/',
    DEBUG: DEBUG_MODE,
    PORT: process.env.PORT ? process.env.PORT : 3000,

    DB_NAME: LOCAL_ENVIRONMENT ? 'administrative_cai' : 'administrative_cai_prod',
    DB_USER: LOCAL_ENVIRONMENT ? 'root' : 'root',
    DB_PASSWORD: LOCAL_ENVIRONMENT ? '' : 'root',
    DB_HOST: LOCAL_ENVIRONMENT ? 'localhost' : 'localhost',
    DB_PORT: 3306,
    DB_CHARSET: 'utf8mb4_general_ci',
    DB_UTC: 'UTC',

    GENERAL_MESSAGE_ERROR: 'Ah ocurrido un error, por favor intente de nuevo más tarde.',
    GENERAL_MESSAGE_NOT_FOUND: 'No se encontro registro con ese identificador',
};

const express = require('express');
const UserController = require('../controllers/UserController');
const oRouter = express.Router();
/**
 * Constante que representa el controlador principal de estas rutas.
 */
const Controller = new UserController();
/**
 * Archivo que representa las acciones que se toman para las rutas respectivas a '/users'.
 */
oRouter.post('/login', (oRequest, oResponse) => {
    Controller.login(oRequest, oResponse);
});

oRouter.get('/logout', (oRequest, oResponse) => {
    Controller.logout(oRequest, oResponse);
});

oRouter.get('/token', (oRequest, oResponse) => {
    Controller.checkToken(oRequest, oResponse);
});

module.exports = oRouter;
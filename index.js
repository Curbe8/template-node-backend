const express = require('express'),
    app = express(),
    cors = require('cors'),
    oBodyParser = require('body-parser'),
    oEnvironment = require('./src/constants/Environment.js');

// use the modules
app.use(cors({ origin: '*', methods: ['GET', 'POST', 'DELETE'], allowedHeaders: ['Content-Type', 'authorization'] }));
app.use(oBodyParser.json());

if (oEnvironment.DEBUG) {
    const oMorgan = require('morgan');
    app.use(oMorgan('dev'));
}

// Se levanta el servidor
app.listen(oEnvironment.PORT, () => console.log(`Server started, listening port: ${oEnvironment.PORT}`));

// Se inicializan las rutas
const oRoutes = require('./src/routes/Routes.js');
oRoutes(app);
const express = require('express');
const app = express();

// Middlewares
const { jsonParser, urlencodedParser } = require('./middleware/bodyParserConfig');
const { handleJsonErrors, handleAppErrors } = require('./middleware/errorHandler');
const { securityHeaders } = require('./middleware/securityHeaders');

// Configuración básica
app.use(securityHeaders);
app.use(jsonParser);
app.use(urlencodedParser);

// Manejo de errores de JSON debe ir después de bodyParser pero antes de las rutas
app.use(handleJsonErrors);

// Rutas
app.use('/', require('./routes'));

// Manejo de otros errores
app.use(handleAppErrors);

// Inicio del servidor
const port = process.env.PORT || 3000;
require('./middleware/databaseConnection').initDatabase(app, port);
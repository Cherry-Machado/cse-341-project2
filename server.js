const express = require('express');
const app = express();

// Middlewares
const { jsonParser, urlencodedParser } = require('./middleware/bodyParserConfig');
const { handleJsonErrors, handleAppErrors } = require('./middleware/errorHandler');
const { securityHeaders } = require('./middleware/securityHeaders');
const notFoundHandler = require('./middleware/notFoundHandler'); 

// Basic Configuration
app.use(securityHeaders);
app.use(jsonParser);
app.use(urlencodedParser);

// Handling JSON Errors
app.use(handleJsonErrors);

// Routes
app.use('/', require('./routes'));

// 404 Handler
app.use(notFoundHandler);

// Handling Errors
app.use(handleAppErrors);

// Initializing Server
const port = process.env.PORT || 3000;
require('./middleware/databaseConnection').initDatabase(app, port);
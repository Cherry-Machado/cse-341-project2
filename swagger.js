const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'My Store API',
    description: 'This is my personal project of Store API of CSE 341 Web Services Class',
  },
  host: 'cse-341-project2-qlab.onrender.com/',
  schemes: ['https'],
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

// generate swagger.json
swaggerAutogen(outputFile, endpointsFiles, doc);

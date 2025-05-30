const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'CSE 341 Web Services - Cherry Machado',
    description: 'This is my personal project of Store API Week 3 (Handling-Errors and Validations)',
  },
  host: 'cse-341-project2-qlab.onrender.com',
  schemes: ['https'],
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

// generate swagger.json
swaggerAutogen(outputFile, endpointsFiles, doc);

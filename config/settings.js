const swaggerJsDoc = require('swagger-jsdoc');

// Listener definition
const port = 3000;
const listener = 'localhost';

// Swagger definition
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Wspomagacz API',
      version: '1.0.0',
      description: 'WspomagaczBackend API for WspomagaczFrontend',
      },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  // Path to the API docs
  apis: ['./routes/*.js'],
};

// Initialize swagger-jsdoc
const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = {
  port,
  listener,
  swaggerOptions,
  swaggerDocs
}
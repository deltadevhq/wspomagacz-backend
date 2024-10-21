const swaggerJsDoc = require('swagger-jsdoc');

// Listener definition
const port = 3000;
const listener = 'localhost';
const timezone = 'Europe/Warsaw';

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
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'token',
        },
      },
    },
    security: [
      {
        cookieAuth: [],
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
  timezone,
  swaggerOptions,
  swaggerDocs
}
require('./config/logger');
const swaggerJsDoc = require('swagger-jsdoc');
const packageJson = require('./package.json');

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
    apis: ['./docs/*.yaml'],
};

// Initialize swagger-jsdoc
const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = {
    swaggerOptions,
    swaggerDocs,
    packageJson,
}
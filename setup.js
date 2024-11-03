const swaggerJsDoc = require('swagger-jsdoc');
const packageJson = require('./package.json');
const morgan = require('morgan');
const { getTimestamp } = require('./utilities/dateUtils');

// Override console.log to include a timestamp and state
const baseConsoleLog = console.log;
console.log = function (...args) {
    baseConsoleLog(`[INFO][${getTimestamp()}]`, ...args);
};

// Override console.warn to include a timestamp and state
const baseConsoleWarn = console.warn;
console.warn = function (...args) {
    baseConsoleWarn(`[WARN][${getTimestamp()}]`, ...args);
};

// Override console.error to include a timestamp and state
const baseConsoleError = console.error;
console.error = function (...args) {
    baseConsoleError(`[ERROR][${getTimestamp()}]`, ...args);
};

// Define a custom token for the date in timezone from configuration
morgan.token('date', () => {
    return getTimestamp();
});

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
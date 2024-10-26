const swaggerJsDoc = require('swagger-jsdoc');
const packageJson = require('./package.json');
const moment = require('moment-timezone');
const morgan = require('morgan');
const { applicationTimezone } = require('./config/settings');

// Function to generate a timestamp in timezone from configuration
const getTimestamp = () => {
    return moment().tz(applicationTimezone).format('YYYY-MM-DD HH:mm:ss');
};

// Override console.log to include a timestamp
const baseConsoleLog = console.log;
console.log = function (...args) {
    baseConsoleLog(`[INFO][${getTimestamp()}]`, ...args);
};

// Override console.error to include a timestamp
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
    apis: ['./routes/*.js'],
};

// Initialize swagger-jsdoc
const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = {
    swaggerOptions,
    swaggerDocs,
    packageJson,
}
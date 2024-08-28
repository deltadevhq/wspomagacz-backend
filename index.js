const express = require('express');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const app = express();
const { userRoutes, authRoutes } = require('./routes');
const { port, listener, swaggerOptions, swaggerDocs } = require('./config/settings')

app.use(express.json());

// Use morgan to log requests to the console
app.use(morgan('[:date[clf]] Request: :method :url HTTP/:http-version, Response: :status, ResponseTime: :response-time ms'));

// Define specific routes
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Start the server
app.listen(port, () => {
  console.log(`API listening at http://${listener}:${port}`);
});


// TODO: IMPORTANT!! CREATE A FUNCTION TO OMIT IDOR VULNERABILITY
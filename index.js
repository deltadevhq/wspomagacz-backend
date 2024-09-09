const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express');
const app = express();
const { authRoutes, userRoutes, muscleRoutes, equipmentRoutes, exerciseRoutes } = require('./routes');
const { port, listener, swaggerDocs } = require('./config/settings')

// Use morgan to log requests to the console
app.use(morgan('[:date[clf]] Request: :method :url HTTP/:http-version, Response: :status, ResponseTime: :response-time ms'));
// Use cookieparser to parse cookies
app.use(cookieParser());
app.use(express.json());

// Define specific routes
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/muscles', muscleRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/exercises', exerciseRoutes);



// Start the server
app.listen(port, () => {
  console.log(`API listening at http://${listener}:${port}`);
});


// TODO: IMPORTANT!! CREATE A FUNCTION TO OMIT IDOR VULNERABILITY
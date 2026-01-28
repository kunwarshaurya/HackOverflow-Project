const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');

const app = express();

//Connect to Database
connectDB();

//Middlewares
app.use(express.json()); 
app.use(express.urlencoded({ extended: false })); 
app.use(cors()); 
app.use(helmet()); 
app.use(morgan('dev'));

// Routes
//auth route
app.use('/api/auth', require('./routes/authRoutes'));
//event route
app.use('/api/events', require('./routes/eventRoutes'));
//analytics route
app.use('/api/analytics', require('./routes/analyticsRoutes'));
//for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
//club routes
app.use('/api/clubs', require('./routes/clubRoutes'));
//venue
app.use('/api/venues', require('./routes/resourceRoutes'));


app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'HackOverflow Backend is Running!',
    timestamp: new Date().toISOString()
  });
});

//Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});


const PORT = process.env.PORT || 9999;
const server = app.listen(PORT, () => {
  console.log(`\n Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(` http://localhost:${PORT}`);
});


process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
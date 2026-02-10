const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const app = express();

// View Engine Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static Files
app.use(express.static(path.join(__dirname, '../public')));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET || 'client_session_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

// Auth Middleware
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.isAuthenticated = !!req.session.user;
  next();
});

// Routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/admin', require('./routes/admin'));
app.use('/club', require('./routes/club'));
app.use('/student', require('./routes/student'));
app.use('/events', require('./routes/events'));
app.use('/chat', require('./routes/chat'));
app.use('/notifications', require('./routes/notifications'));

// 404 Handler
app.use((req, res) => {
  res.status(404).render('error', { 
    title: '404 - Page Not Found',
    error: 'The page you are looking for does not exist.',
    statusCode: 404
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', {
    title: '500 - Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!',
    statusCode: 500
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n🚀 Client running on http://localhost:${PORT}`);
  console.log(`📡 Connected to API: ${process.env.API_BASE_URL}`);
});
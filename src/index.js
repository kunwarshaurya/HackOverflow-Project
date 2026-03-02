// server.js (Session-based MVC Final)

const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, '../.env')
});

const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const morgan = require('morgan');

const connectDB = require('./config/db');
const { isAuthenticated } = require('./middlewares/authMiddleware');
const { startScheduledJobs } = require('./jobs/scheduledJobs');
const app = express();

// ================= SESSION SECRET VALIDATION =================
if (!process.env.SESSION_SECRET) {
  throw new Error('SESSION_SECRET environment variable is required. Set it in your .env file.');
}

// ================= DATABASE =================
connectDB();

// ================= SECURITY & LOGGING =================
app.use(helmet());
app.use(morgan('dev'));

// ================= BODY PARSERS =================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ================= SESSION CONFIG =================
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // set true only in production with HTTPS
    maxAge: 24 * 60 * 60 * 1000
  }
}));

// ================= VIEW ENGINE =================
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// ================= STATIC FILES =================
app.use(express.static(path.join(__dirname, '../public')));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ================= GLOBAL AUTH VARIABLES =================
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.isAuthenticated = !!req.session.user;
  next();
});

// ================= GLOBAL COUNTS (pendingCount + unreadNotifications) =================
const Event = require('./models/Event');
const Notification = require('./models/Notification');

app.use(async (req, res, next) => {
  try {
    if (req.session.user) {
      // Unread notification count for all authenticated users
      res.locals.unreadNotificationCount = await Notification.countDocuments({
        recipient: req.session.user._id,
        isRead: false
      });

      // Pending event count for admins only
      if (req.session.user.role === 'admin') {
        res.locals.pendingCount = await Event.countDocuments({ status: 'pending' });
      } else {
        res.locals.pendingCount = 0;
      }
    } else {
      res.locals.pendingCount = 0;
      res.locals.unreadNotificationCount = 0;
    }
  } catch (err) {
    res.locals.pendingCount = 0;
    res.locals.unreadNotificationCount = 0;
  }
  next();
});
// ================= ROUTES =================
app.use('/auth', require('./routes/authRoutes'));
app.use('/events', require('./routes/eventRoutes'));
app.use('/club', require('./routes/clubRoutes'));
app.use('/chat', require('./routes/chatRoutes'));
app.use('/notifications', require('./routes/notificationRoutes'));
app.use('/student', require('./routes/studentRoutes'));
app.use('/admin', require('./routes/adminRoutes'));
app.use('/analytics', require('./routes/analyticsRoutes'));
app.use('/activity', require('./routes/activityRoutes'));
app.use('/resources', require('./routes/resourceRoutes'));
app.use('/admin/equipment', require('./routes/equipmentRoutes'));

// ================= HOME ROUTE =================
app.get('/', (req, res) => {
  res.render('index', {
    title: 'HackOverflow - Home'
  });
});

app.get('/dashboard', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }

  const role = req.session.user.role;

  if (role === 'admin') return res.redirect('/admin/dashboard');
  if (role === 'club_lead') return res.redirect('/club/dashboard');
  return res.redirect('/student/dashboard');
});

// ================= ERROR HANDLING =================
const { notFoundHandler, globalErrorHandler } = require('./middlewares/errorHandler');
app.use(notFoundHandler);
app.use(globalErrorHandler);

// ================= SERVER START =================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  process.stdout.write(`Server running on http://localhost:${PORT}\n`);
  startScheduledJobs();
});
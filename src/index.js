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
const autoCompleteEvents = require('./utils/autoCompleteEvents');
const app = express();

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
  secret: process.env.SESSION_SECRET || 'super_secret_key',
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

//===============Auto Complete================================
app.use(async (req, res, next) => {
  await autoCompleteEvents();
  next();
});

//pendingCount
const Event = require('./models/Event');

app.use(async (req, res, next) => {
  try {
    if (req.session.user && req.session.user.role === 'admin') {
      const pendingCount = await Event.countDocuments({ status: 'pending' });
      res.locals.pendingCount = pendingCount;
    } else {
      res.locals.pendingCount = 0;
    }
  } catch (err) {
    res.locals.pendingCount = 0;
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

// ================= DASHBOARD ROUTE (RBAC) =================
// app.get('/dashboard', async (req, res) => {
//   if (!req.session.user) {
//     return res.redirect('/auth/login');
//   }

//   const role = req.session.user.role;

//   // Safe default values
//   const events = [];
//   const clubs = [];
//   const stats = {
//     totalEvents: 0,
//     totalClubs: 0,
//     totalUsers: 0,
//     pendingApprovals: 0
//   };

//   if (role === 'admin') {
//     return res.render('admin/dashboard', {
//       title: 'Admin Dashboard',
//       stats,
//       events,
//       clubs
//     });
//   }

//   if (role === 'club_lead') {
//     return res.render('club/dashboard', {
//       title: 'Club Lead Dashboard',
//       events,
//       clubs
//     });
//   }

//   return res.render('student/dashboard', {
//     title: 'Student Dashboard',
//     events,
//     clubs
//   });
// });

// ================= 404 HANDLER =================
app.use((req, res) => {
  res.status(404).render('error', {
    title: '404 - Not Found',
    error: 'The page you are looking for does not exist.',
    statusCode: 404
  });
});

// ================= ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.error(err.stack);

  const status = err.status || 500;

  res.status(status).render('error', {
    title: `${status} - Error`,
    error: process.env.NODE_ENV === 'development'
      ? err.message
      : 'Something went wrong!',
    statusCode: status
  });
});

// ================= SERVER START =================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
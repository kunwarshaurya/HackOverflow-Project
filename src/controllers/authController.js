// src/controllers/authController.js

const User = require('../models/user');

// ================= REGISTER =================
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, clubName, department, year } = req.body;

    // Server-side enforcement: only student or club_lead allowed
    const allowedRoles = ['student', 'club_lead'];
    const safeRole = allowedRoles.includes(role) ? role : 'student';

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.render('auth/register', {
        title: 'Register',
        error: 'User already exists'
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: safeRole,
      clubName,
      department,
      year
    });

    // Store safe user object in session (strip password hash)
    req.session.user = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      year: user.year,
      joinedClubs: user.joinedClubs,
      managedClub: user.managedClub,
      createdAt: user.createdAt
    };

    res.redirect('/');
  } catch (error) {
    res.render('auth/register', {
      title: 'Register',
      error: 'Something went wrong during registration'
    });
  }
};


// ================= LOGIN =================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.render('auth/login', {
        title: 'Login',
        error: 'Invalid credentials'
      });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.render('auth/login', {
        title: 'Login',
        error: 'Invalid credentials'
      });
    }

    // Store safe user object in session (strip password hash)
    req.session.user = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      year: user.year,
      joinedClubs: user.joinedClubs,
      managedClub: user.managedClub,
      createdAt: user.createdAt
    };

    res.redirect('/dashboard');
  } catch (error) {
    res.render('auth/login', {
      title: 'Login',
      error: 'Something went wrong during login'
    });
  }
};


// ================= LOGOUT =================
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect('/dashboard');
    }
    res.clearCookie('connect.sid');
    res.redirect('/');
  });
};
// src/middlewares/authMiddleware.js

const isAuthenticated = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }
  // Single source of truth: attach session user to req.user
  req.user = req.session.user;
  // Ensure .id alias exists for backward compatibility (Mongoose documents have virtual `id`)
  if (req.user._id && !req.user.id) {
    req.user.id = req.user._id.toString();
  }
  next();
};

const authorize = (...roles) => {
  return (req, res, next) => {
    // req.user is already set by isAuthenticated (which must run first)
    if (!req.user) {
      return res.redirect('/auth/login');
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).render('error', {
        title: 'Access Denied',
        error: 'You are not authorized to access this page.',
        statusCode: 403
      });
    }

    next();
  };
};

module.exports = {
  isAuthenticated,
  authorize
};
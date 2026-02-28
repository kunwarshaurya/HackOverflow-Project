// src/middlewares/authMiddleware.js

const isAuthenticated = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }
  // CRITICAL FIX: Attach session user to req.user for controllers
  req.user = req.session.user;
  next();
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.session.user) {
      return res.redirect('/auth/login');
    }
    
    // CRITICAL FIX: Ensure req.user is available for downstream controllers
    req.user = req.session.user;

    if (!roles.includes(req.session.user.role)) {
      return res.status(403).render('error', {
        title: 'Access Denied',
        error: 'You are not authorized to access this page.',
        statusCode: 403
      });
    }

    req.user = req.session.user;
    next();
  };
};

module.exports = {
  isAuthenticated,
  authorize
};
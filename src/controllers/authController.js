const User = require('../models/user');

// ================= REGISTER =================
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, clubName, department, year } = req.body;

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
      role,
      clubName,
      department,
      year
    });

    // Save user in session
    req.session.user = user;

    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.render('auth/register', {
      title: 'Register',
      error: 'Something went wrong'
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

    // Save user in session
    req.session.user = user;

res.redirect('/dashboard');
  } catch (error) {
    console.error(error);
    res.render('auth/login', {
      title: 'Login',
      error: 'Something went wrong'
    });
  }
};
// src/middlewares/validators.js

const { body, validationResult } = require('express-validator');

const handleValidationErrors = (redirectPath, viewName, viewData = {}) => {
    return (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const firstError = errors.array()[0].msg;
            return res.render(viewName, {
                title: viewData.title || 'Error',
                error: firstError,
                ...viewData
            });
        }
        next();
    };
};

const registerValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please enter a valid email address')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('role')
        .notEmpty().withMessage('Role is required')
        .isIn(['student', 'club_lead']).withMessage('Invalid role selected'),
    handleValidationErrors('/auth/register', 'auth/register', { title: 'Register' })
];

const loginValidation = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please enter a valid email address')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('Password is required'),
    handleValidationErrors('/auth/login', 'auth/login', { title: 'Login' })
];

module.exports = {
    registerValidation,
    loginValidation
};

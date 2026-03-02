// src/middlewares/errorHandler.js
// Centralized error handling middleware.

/**
 * Custom application error with status code.
 * Usage: throw new AppError('message', 400);
 */
class AppError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * 404 handler — catches requests that didn't match any route.
 */
function notFoundHandler(req, res, _next) {
    res.status(404).render('error', {
        title: '404 - Not Found',
        error: 'The page you are looking for does not exist.',
        statusCode: 404
    });
}

/**
 * Global error handler — catches all errors passed via next(err).
 *
 * - In development: shows full error message + stack trace in console.
 * - In production: shows generic message, hides internals.
 * - For AJAX/JSON requests: returns JSON instead of rendering a page.
 */
function globalErrorHandler(err, req, res, _next) {
    const statusCode = err.statusCode || err.status || 500;
    const isDev = process.env.NODE_ENV !== 'production';

    // Always log in development; in production, only log server errors
    if (isDev || statusCode >= 500) {
        console.error(`[ERROR ${statusCode}] ${err.message}`);
        if (isDev && err.stack) {
            console.error(err.stack);
        }
    }

    // Determine user-facing message
    const userMessage = err.isOperational || isDev
        ? err.message
        : 'Something went wrong. Please try again later.';

    // If the client expects JSON (AJAX calls), return JSON
    if (req.xhr || (req.headers.accept && req.headers.accept.includes('application/json'))) {
        return res.status(statusCode).json({
            success: false,
            error: userMessage
        });
    }

    // Otherwise render the error page
    res.status(statusCode).render('error', {
        title: `${statusCode} - Error`,
        error: userMessage,
        statusCode
    });
}

module.exports = {
    AppError,
    notFoundHandler,
    globalErrorHandler
};

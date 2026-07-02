"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.notFound = void 0;
const notFound = (req, res, _next) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.originalUrl}`,
    });
};
exports.notFound = notFound;
const errorHandler = (err, _req, res, _next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';
    // Mongoose duplicate key error
    if (err.code === 11000) {
        statusCode = 400;
        message = 'Duplicate field value. Please use a different value.';
    }
    // Mongoose validation error
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = err.message;
    }
    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid token.';
    }
    if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Token expired.';
    }
    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=error.middleware.js.map
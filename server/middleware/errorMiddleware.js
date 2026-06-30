// ============================================================
// middleware/errorMiddleware.js
// Global error handling middleware for Express.
//
// Two handlers are exported:
//   1. notFound     – catches requests to undefined routes (404)
//   2. errorHandler – global error handler for all thrown/forwarded errors
//
// Both must be mounted AFTER all routes in server.js.
// ============================================================

// ----------------------------
// 404 – Not Found Handler
// ----------------------------
// If no route above matched the request, this middleware fires.
// It creates a proper Error object and passes it to errorHandler via next().
const notFound = (req, res, next) => {
  const error = new Error(`Not Found – ${req.originalUrl}`);
  res.status(404);
  next(error); // Pass error to the global error handler below
};

// ----------------------------
// Global Error Handler
// ----------------------------
// Express recognises this as an error-handling middleware because it
// has FOUR parameters (err, req, res, next) — this is required by Express.
//
// It returns a consistent JSON error shape for every error in the app,
// which is much easier for the frontend to handle than raw HTML error pages.
const errorHandler = (err, req, res, next) => {
  // Sometimes an error is thrown after a 200 response has been set;
  // in that case we default to 500 (Internal Server Error).
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    message: err.message,
    // Only include the full stack trace in development mode
    // so we don't leak internals in production
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

module.exports = { notFound, errorHandler };

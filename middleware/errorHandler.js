// Middleware for handling errors
function errorHandler(err, req, res, next) {
  console.error("Error caught by middleware:", err.message);

  // If response already sent, delegate to default Express handler
  if (res.headersSent) {
    return next(err);
  }

  // Render error view
  res.status(500).render("error", {
    title: "Server Error",
    message: err.message || "An unexpected error occurred.",
    nav: req.nav || "", 
  });
}

module.exports = errorHandler;
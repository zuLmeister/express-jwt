const ErrorHandler = (err, req, res, next) => {
  // Prisma known errors
  if (err.code === "P2002") {
    return res.status(409).json({
      success: false,
      message: "Data sudah ada (unique constraint violation)",
    });
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  // Production: jangan kasih stack trace
  if (process.env.NODE_ENV === "production") {
    return res.status(statusCode).json({ success: false, message });
  }

  // Development: kasih detail
  console.error("ERROR:", err);
  res.status(statusCode).json({
    success: false,
    message,
    stack: err.stack,
  });
};

module.exports = ErrorHandler;

export function errorMiddleware(err, req, res, next) {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong";

  if (!res.headersSent) {
    return res.status(errorStatus).json({
      success: false,
      status: errorStatus,
      message: errorMessage,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  }

  next(err);
}

const success = (res, data = null, message = "Success", statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

const error = (res, message = "Bad Request", statusCode = 400) => {
  res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = { success, error };

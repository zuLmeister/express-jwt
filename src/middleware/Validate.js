const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    const message = error.errors[0]?.message || "Invalid input data";
    return res.status(400).json({
      success: false,
      message,
    });
  }
};

module.exports = validate;

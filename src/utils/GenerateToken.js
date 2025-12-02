const jwt = require("jsonwebtoken");

module.exports = function generateTokens(user) {
  const accessPayload = {
    id: user.id,
    email: user.email,
  };

  const accessToken = jwt.sign(accessPayload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRE || "15m",
  });

  const refreshPayload = {
    id: user.id,
    version: user.refreshTokenVersion || 0,
  };

  const refreshToken = jwt.sign(
    refreshPayload,
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRE || "7d",
    }
  );

  return { accessToken, refreshToken };
};

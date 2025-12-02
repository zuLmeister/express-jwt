const AuthService = require("../services/AuthService");
const CatchAsync = require("../utils/catchAsync");
const { addToBlacklist } = require("../utils/TokenBlacklist");
const { success, error } = require("../utils/Response");
const jwt = require("jsonwebtoken");

class AuthController {
  static register = CatchAsync(async (req, res) => {
    const { user, accessToken, refreshToken } = await AuthService.register(
      req.body
    );

    success(
      res,
      {
        user: { id: user.id, name: user.name, email: user.email },
        accessToken,
        refreshToken,
      },
      "User registered successfully",
      201
    );
  });

  static login = CatchAsync(async (req, res) => {
    const { user, accessToken, refreshToken } = await AuthService.login(
      req.body
    );

    success(res, {
      user: { id: user.id, name: user.name, email: user.email },
      accessToken,
      refreshToken,
    });
  });

  static refresh = CatchAsync(async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res
        .status(400)
        .json({ success: false, message: "Refresh token required" });
    }

    const tokens = await AuthService.refreshToken(refreshToken);
    success(res, tokens, "Token refreshed successfully");
  });

  static logout = CatchAsync(async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (token) {
      const decoded = jwt.decode(token);
      if (decoded?.exp) addToBlacklist(token, decoded.exp);
    }

    await AuthService.logout(req.user.id);
    success(res, null, "Logout successful. Session terminated.");
  });
}

module.exports = AuthController;

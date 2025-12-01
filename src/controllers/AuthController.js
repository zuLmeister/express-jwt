const AuthService = require("../services/AuthService");
const { addToBlacklist } = require("../utils/TokenBlacklist");
const jwt = require("jsonwebtoken");

class AuthController {
  static async register(req, res) {
    try {
      const { name, email, password } = req.body;
      const { user, accessToken, refreshToken } = await AuthService.register({
        name,
        email,
        password,
      });

      return res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: {
          user: { id: user.id, name: user.name, email: user.email },
          accessToken,
          refreshToken,
        },
      });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const { user, accessToken, refreshToken } = await AuthService.login({
        email,
        password,
      });

      return res.json({
        success: true,
        data: {
          user: { id: user.id, name: user.name, email: user.email },
          accessToken,
          refreshToken,
        },
      });
    } catch (error) {
      return res.status(401).json({ success: false, message: error.message });
    }
  }

  static async refresh(req, res) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        return res
          .status(400)
          .json({ success: false, message: "Refresh token required" });
      }

      const tokens = await AuthService.refreshToken(refreshToken);
      return res.json({ success: true, ...tokens });
    } catch (error) {
      return res.status(401).json({ success: false, message: error.message });
    }
  }

  // INI YANG BARU – LOGOUT DENGAN INVALIDASI ACCESS TOKEN!
  static async logout(req, res) {
    try {
      const userId = req.user.id;
      const authHeader = req.headers.authorization;

      // 1. Blacklist access token (biar langsung mati)
      if (authHeader?.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1];
        const decoded = jwt.decode(token);

        if (decoded?.exp) {
          addToBlacklist(token, decoded.exp);
        }
      }

      // 2. Hapus refresh token dari database (revoke session)
      await AuthService.logout(userId);

      return res.json({
        success: true,
        message: "Logout successful. Session terminated.",
      });
    } catch (error) {
      console.error("Logout error:", error);
      return res.status(500).json({
        success: false,
        message: "Logout failed",
      });
    }
  }
}

module.exports = AuthController;

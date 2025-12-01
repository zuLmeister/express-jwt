const AuthService = require("../services/AuthService");

const AuthController = {
  register: async (req, res) => {
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
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
          },
          accessToken,
          refreshToken,
        },
      });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const { user, accessToken, refreshToken } = await AuthService.login({
        email,
        password,
      });

      return res.json({
        success: true,
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
          },
          accessToken,
          refreshToken,
        },
      });
    } catch (error) {
      return res.status(401).json({ success: false, message: error.message });
    }
  },

  refresh: async (req, res) => {
    try {
      const { refreshToken } = req.body;
      const tokens = await AuthService.refreshToken(refreshToken);

      return res.json({
        success: true,
        ...tokens,
      });
    } catch (error) {
      return res.status(401).json({ success: false, message: error.message });
    }
  },
};

module.exports = AuthController;

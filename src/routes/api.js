// src/routes/api.js
const express = require("express");
const router = express.Router();

const UserController = require("../controllers/UserController");
const AuthController = require("../controllers/AuthController");
const authMiddleware = require("../middleware/authMiddleware");
const authLimiter = require("../middleware/rateLimiter");

// Validator
const validate = require("../middleware/Validate");
const {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
} = require("../validators/AuthValidator");

// AUTH ROUTES — DENGAN VALIDASI
router.post(
  "/register",
  authLimiter,
  validate(registerSchema),
  AuthController.register
);
router.post("/login", authLimiter, validate(loginSchema), AuthController.login);
router.post(
  "/auth/refresh-token",
  validate(refreshTokenSchema),
  AuthController.refresh
);
router.post("/logout", authMiddleware, AuthController.logout);

// PROTECTED ROUTES
router.get("/me", authMiddleware, (req, res) => {
  res.json({
    success: true,
    message: "Token valid",
    data: {
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
      },
    },
  });
});

// PUBLIC ROUTES (kalau mau kasih pagination nanti)
router.get("/users", UserController.index);

module.exports = router;

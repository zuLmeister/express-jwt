const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const AuthController = require("../controllers/AuthController");
const authMiddleware = require("../middleware/authMiddleware");
const authLimiter = require("../middleware/rateLimiter");

// AUTH ROUTES
router.post("/register", authLimiter, AuthController.register);
router.post("/login", authLimiter, AuthController.login);
router.post("/auth/refresh-token", AuthController.refresh);
router.post("/logout", authMiddleware, AuthController.logout);

// PROTECTED ROUTE
router.get("/me", authMiddleware, (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

// PUBLIC ROUTES
router.get("/users", UserController.index);

module.exports = router;

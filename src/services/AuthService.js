const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");
const GenerateToken = require("../utils/GenerateToken");

class AuthService {
  static async register({ name, email, password }) {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    const { accessToken, refreshToken } = GenerateToken(user);

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    return { user, accessToken, refreshToken };
  }

  static async login({ email, password }) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("Invalid email or password");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid email or password");

    const { accessToken, refreshToken } = GenerateToken(user);

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    return { user, accessToken, refreshToken };
  }

  static async refreshToken(token) {
    const jwt = require("jsonwebtoken");

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      if (payload.version !== user.refreshTokenVersion) {
        throw new Error("Refresh token has been revoked");
      }
    } catch (err) {
      throw new Error("Invalid or expired refresh token");
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: { id: true, refreshToken: true, refreshTokenVersion: true },
    });

    if (!user) throw new Error("User not found");
    if (!user.refreshToken) throw new Error("No active session");

    if (user.refreshToken !== token) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          refreshToken: null,
          refreshTokenVersion: { increment: 1 },
        },
      });
      throw new Error(
        "Refresh token reused - possible theft! All sessions revoked"
      );
    }

    const { accessToken, refreshToken: newRefreshToken } = GenerateToken(user);

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: newRefreshToken },
    });

    return { accessToken, refreshToken: newRefreshToken };
  }

  static async logout(userId) {
    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });

    return { success: true, message: "Logged out successfully" };
  }
}

module.exports = AuthService;

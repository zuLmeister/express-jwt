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

    const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    const user = await prisma.user.findUnique({ where: { id: payload.id } });
    if (!user) throw new Error("Invalid refresh token");

    if (user.refreshToken !== token) throw new Error("Refresh token mismatch!");

    const { accessToken, refreshToken } = GenerateToken(user);

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    return { accessToken, refreshToken };
  }
}

module.exports = AuthService;

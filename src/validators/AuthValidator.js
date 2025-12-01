const { z } = require("zod");

const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Nama minimal 2 karakter")
    .max(50, "Nama terlalu panjang"),
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
});

const loginSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
});

const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token wajib diisi"),
});

module.exports = {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
};

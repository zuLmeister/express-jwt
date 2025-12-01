# ExpressJS Authentication Boilerplate

> A clean, secure, and production-ready Express.js authentication boilerplate with JWT & refresh token support.

## Features

| Features                                   | Status |
| ------------------------------------------ | ------ |
| Register & Login + JWT Authentication      | Done   |
| Refresh Token System                       | Done   |
| Rate Limiting untuk Auth Routes            | Done   |
| Secure Middleware (Helmet)                 | Done   |
| Authentication Middleware (Protect Routes) | Done   |
| Password Hashing (bcrypt)                  | Done   |
| Prisma ORM (MySQL)                         | Done   |
| CORS Support                               | Done   |
| Clean Modular Architecture                 | Done   |

## Project Structure

```bash
src/
├── controllers/
│   └── AuthController.js
├── middleware/
│   ├── authMiddleware.js
│   └── rateLimiter.js
├── routes/
│   └── api.js
├── services/
│   └── AuthService.js
├── utils/
│   └── generateTokens.js
prisma/
│   └── schema.prisma
server.js
.env.example
package.json
```

## Installation & Setup

```bash
git clone https://github.com/zuLmeister/expressjs-auth-boilerplate.git
cd expressjs-auth-boilerplate
npm install

## Copy .env.example menjadi .env lalu isi:
APP_PORT=3000

DATABASE_URL="mysql://root:@localhost:3306/express_boilerplate"

JWT_SECRET=yourVeryStrongAccessTokenSecret123!
JWT_REFRESH_SECRET=yourVeryStrongRefreshTokenSecret456@
JWT_EXPIRES_IN=1d
JWT_REFRESH_EXPIRES_IN=7d
```

## Prisma Migration

```bash
npx prisma migrate dev
```

## Running the Server

```bash
node server.js
```

## Import File Postman Collection

```bash
postman-collection.json
```

## Security Notes

- All passwords are hashed using bcryptjs
- JWT access tokens expire in 1 day, refresh tokens in 7 days
- Rate limiting applied to login/register endpoints (100 requests per 15 minutes)
- Helmet.js is used for basic HTTP header security
- Refresh tokens are stored securely and rotated on use

## License

```bash
MIT — Free to use for learning, personal projects, or commercial applications.
```

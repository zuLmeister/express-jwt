require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const apiRoutes = require("./src/routes/api");
const errorHandler = require("./src/middleware/errorHandler"); // BARU

const app = express();

// Security Middleware
app.use(helmet());
app.use(cors());

// Body Parser (tambahi limit biar aman)
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Routes
app.use("/api", apiRoutes);

// GLOBAL ERROR HANDLER
app.use(errorHandler);

const PORT = process.env.APP_PORT || 3000;
app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});

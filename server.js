require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const apiRoutes = require("./src/routes/api");

const app = express();

// Security Middleware
app.use(helmet());
app.use(cors());

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", apiRoutes);

const PORT = process.env.APP_PORT || 3000;
app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});

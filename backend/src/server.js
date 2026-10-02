const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();
const { testDatabaseConnection } = require("./config/database");
const authRoutes = require("./routes/authRoutes");

const app = express();

const PORT = process.env.PORT || 5000;

// Security & middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "ARSec API is running",
    environment: process.env.NODE_ENV || "development",
  });
});

// Root API
app.get("/api", (req, res) => {
  res.json({
    name: "ARSec Portfolio API",
    version: "1.0.0",
    status: "online",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found",
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message,
  });
});

app.listen(PORT, async () => {
  try {
    await testDatabaseConnection();
  } catch (error) {
    console.error("✗ PostgreSQL connection failed");
    console.error(error.message);
  }

  console.log("");
  console.log("======================================");
  console.log("        ARSec API Server");
  console.log("======================================");
  console.log(`Server: http://localhost:${PORT}`);
  console.log(`Health: http://localhost:${PORT}/api/health`);
  console.log("======================================");
  console.log("");
});

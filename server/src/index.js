// Import packages
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

// Import config / routes
const config = require("./config/config");
const apiErrorHandler = require("./middleware/apiErrorHandler");
const ApiError = require("./utilities/ApiError");
const routes = require("./routes/routes");

// Custom debug logs
const startLog = require("debug")("app: startup");

// Import database and Cloudinary configurations
const { dbPing } = require("./config/db");
const connectCloudinary = require("./config/cloudinary");

// Create Express application
const app = express();

// Configure Cloudinary
connectCloudinary();

// Middleware for parsing incoming requests
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Allow requests from frontend
app.use(cors());

// Log HTTP requests during development
app.use(morgan("dev"));

// Register API routes
// Express endpoint: http://localhost:4000/api
startLog("Accessing endpoints under /api ...");

// All paths in routes now start with "/api"
app.use("/api", routes());

// Handle routes that do not exist: 404 NOT FOUND
app.use((req, res, next) => {
  // const err = new Error("404 - Resource Not Found");
  // err.status = 404;
  // res.status(err.status).send(err);
  next(ApiError.notFound());
});

// Handle application errors: 400s & 500s
app.use(apiErrorHandler);

// Check database connection before starting the server
// dbping holds the Promise representing this operation
dbPing
  // Run when Firestore returns the collections
  .then(() => {
    app.listen(config.port, () =>
      console.log(`Server is running on port: ${config.port}`),
    );
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });

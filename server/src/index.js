// Import packages
const express = require("express");
require("dotenv").config();
const morgan = require("morgan");

// Import config / routes
const config = require("./config/config");
const apiErrorHandler = require("./middleware/apiErrorHandler");
const ApiError = require("./utilities/ApiError");
const routes = require("./routes/routes");

// Custom debug logs
const startLog = require("debug")("app: startup");
const { dbPing } = require("./config/db");

// Instance of express
const app = express();

// Default middleware for parsing
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Dev morgan output
app.use(morgan("dev"));

// Express endpoint: http://localhost:4000/api
startLog("Accessing endpoints under /api ...");
// All paths in routes now start with "/api"
app.use("/api", routes());

// Error Handlers: 404 NOT FOUND
app.use((req, res, next) => {
  // const err = new Error("404 - Resource Not Found");
  // err.status = 404;
  // res.status(err.status).send(err);
  next(ApiError.notFound());
});

// Error Handlers: 400s & 500s
app.use(apiErrorHandler);

dbPing
  .then(() => {
    app.listen(config.port, () =>
      console.log(`Server is running on port: ${config.port}`),
    );
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });

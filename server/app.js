const express = require('express');
require("express-async-errors");
const app = express();
app.use(express.json());
const dogRoutes = require("./routes/dogs");
require("dotenv").config();

// Use routers
app.use("/dogs", dogRoutes);

// Logger Middleware
app.use((req, res, next) => {
  console.log(`Method:${req.method} URL:${req.url}`);

  res.on("finish", () => {
    console.log(`Response Status: ${res.statusCode}`);
  });
  next();
})

// For testing purposes, GET /
app.get('/', (req, res) => {
  res.json("Express server running. No content provided at root level. Please use another route.");
});

// For testing express.json middleware
app.post('/test-json', (req, res, next) => {
  // send the body as JSON with a Content-Type header of "application/json"
  // finishes the response, res.end()
  res.json(req.body);
  next();
});

// For testing express-async-errors
app.get('/test-error', async (req, res) => {
  throw new Error("Hello World!")
});

app.use((req, res, next) => {
  const error = new Error("The requested resource couldn't be found.");
  error.statusCode = 404;
  next(error);
})

app.use((error, req, res, next) => {
  
  // Prepare the error response with conditional stack trace
  const errorResponse = {
    Error: error.message || "Internal Server Error",
    statusCode: error.statusCode || 500,
  };

  // Only include stack trace if not in production
  if (process.env.NODE_ENV !== "production") {
    errorResponse.stack = error.stack;
  }

  res.json(errorResponse);
});

const port = process.env.PORT;
app.listen(port, () => console.log('Server is listening on port', port));


const express = require("express");
const serverless = require("serverless-http");
const path = require("path");

const app = express();

// Serve static files from 'public'
app.use(express.static(path.join(__dirname, "../public")));

// SPA fallback
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

module.exports = app;              // optional, for testing locally
module.exports.handler = serverless(app);  // Vercel entry point

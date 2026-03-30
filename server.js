// Shim for local development. Points to the logic in /api/index.js.
// Vercel only uses the file in api/ for production.
const express = require('express');
const app = require('./api/index');
// No need to call app.listen here if api/index.js handles it locally
// but for clarity we just export and let it do its thing.
module.exports = app;
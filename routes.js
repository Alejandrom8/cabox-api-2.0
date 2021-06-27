'use strict'
const auth = require('./src/api/auth');

module.exports = function (app, opts) {
  // Setup routes, middleware, and handlers
  app.post('/login', auth.login);
  app.post('/signup', auth.signUp);
  app.get('/refresh/:refreshToken', auth.refresh);
}
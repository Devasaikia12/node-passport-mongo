const routes = require('express').Router()
const passport = require('passport')

routes.get('/google', passport.authenticate('google', { scope: ['profile'] }))

routes.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/users/login' }),
  (req, res) => {
    res.redirect('/dashboard')
  }
)

module.exports = routes

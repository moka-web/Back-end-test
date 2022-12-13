const express = require('express');
const loginRouter = express.Router();
const passport = require('passport');
const { postLogin } = require('../controllers/auth');


loginRouter.post('/', passport.authenticate("login", {failureRedirect:'/failLogin'}),postLogin)

  module.exports= loginRouter ;
  
const express = require('express');
const loginRouter = express.Router();
const passport = require('passport');

loginRouter.post('/', passport.authenticate("login", {failureRedirect:'/failLogin'}), async (req,res) =>{
    res.redirect('/')
  })

  module.exports= loginRouter ;
  
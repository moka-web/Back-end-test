const express = require('express');
const signUpRouter = express.Router();
const upload = require('../config/multer')
const passport = require('passport');


signUpRouter.get('/',(req,res)=>{
    res.render("formSignUp")
  })

  
  
signUpRouter.post('/',upload.single('photo_url'),passport.authenticate("signup", { failureRedirect: "/failsignup" }),
(req,res)=>{
  const {username} = req.user
  req.session.username = username;
  res.redirect('/')
})

module.exports = signUpRouter ; 
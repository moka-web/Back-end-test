const express = require('express');
const signUpRouter = express.Router();
const upload = require('../config/multer')
const passport = require('passport');
const { getSignUp,postSignUp } = require('../controllers/auth');


signUpRouter.get('/',getSignUp)

signUpRouter.post('/',upload.single('photo_url'),passport.authenticate("signup", { failureRedirect: "/failsignup" }),postSignUp)

module.exports = signUpRouter ; 
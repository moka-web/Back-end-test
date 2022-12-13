const express = require('express');
const logger = require('../config/winston');
const { logOut } = require('../controllers/auth');
const logOutRouter = express.Router();


logOutRouter.get('/', logOut)
  

  module.exports = logOutRouter ; 

const express = require('express');
const routerInfo = express.Router()
const { getInfo } = require('../controllers/info.js');

routerInfo.get('/',getInfo)
  
  module.exports = routerInfo ; 
const express = require('express');
const logger = require('../config/winston');
const logOutRouter = express.Router();


logOutRouter.get('/', (req,res)=>{
    try {
        req.logout();
    res.redirect("/");
    } catch (error) {
        logger.error(error)
    }
    
  })
  

  module.exports = logOutRouter ; 

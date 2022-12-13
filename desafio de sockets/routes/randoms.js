const express = require('express');
const routerRandoms = express.Router();
const { fork } = require("child_process");
const { getRandoms, postRandoms } = require('../controllers/randoms');

routerRandoms.get('/',getRandoms)

  routerRandoms.post('/',postRandoms)



  module.exports = routerRandoms;
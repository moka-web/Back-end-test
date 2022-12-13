const express = require('express');
const { checkIfIsAdmin } = require('../utils/checkIfIsAdmin');
const homeRouter = express.Router()
const { getHome } = require('../controllers/home');


homeRouter.get("/", checkIfIsAdmin, getHome);

  module.exports = homeRouter;
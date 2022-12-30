const logger = require("../config/winston");


function checkIfIsAdmin (req,res,next){
    const body = req.body
    if (req.isAuthenticated("true")) {
          next();
        } else {
          logger.info(`usuario not ok `)
          res.render("formLogin");
        }
    
    }

module.exports={checkIfIsAdmin}
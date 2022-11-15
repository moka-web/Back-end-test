
function checkIfIsAdmin (req,res,next){
    const body = req.body
    if (req.isAuthenticated("true")) {
        console.log('usuario ok')
          next();
        } else {
          console.log(`usuario not ok `)
          res.render("formLogin");
        }
    
    }

module.exports={checkIfIsAdmin}
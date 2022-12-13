const { fork } = require("child_process");

async function getRandoms (req,res){
    try {
        res.status(200).render('random')
      } catch (error) {
        res.status(500).send({error:error.message})
      }

}

async function postRandoms (req,res){
    try {
        let cant = req.query.cant;
        console.log(cant)
        const random = fork('./utils/randomJS')
        random.send({message:"start" ,cant: cant})
        random.on("message",(obj)=>{
        res.json(obj)
       })
    } catch (error) {
      res.status(500).send({error: error.message})
    }
}

module.exports={getRandoms,postRandoms}
const express = require('express');
const routerRandoms = express.Router();
const { fork } = require("child_process");

routerRandoms.get('/',(req,res)=>{
    try {
      res.status(200).render('random')
    } catch (error) {
      res.status(500).send({error:error.message})
    }
  })

  routerRandoms.post('/',(req,res)=>{
    try {
      let cant = req.query.cant;
      console.log(cant)
      const random = fork("../utils/randomJS")
      random.send({message:"start" ,cant: cant})
      random.on("message",(obj)=>{
      res.json(obj)
     })
  } catch (error) {
    res.status(500).send({error: error.message})
  }
  })



  module.exports = routerRandoms;
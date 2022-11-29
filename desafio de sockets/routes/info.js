const express = require('express');
const routerInfo = express.Router()
const {PORT, oS, nodeV, paTh, processId, folderPath, maxRSS, numOfProcess} = require('../configEnv.js')

routerInfo.get('/',(req,res)=>{
    const data = {
          os:  oS ,
          nodeVersion: nodeV,
          path: paTh,
          processId: processId,
          folderPath: folderPath,
          maxRSS: maxRSS, 
          procesos:numOfProcess,
          puerto:PORT
    }
   
    res.send(data)
  })
  
  module.exports = routerInfo ; 
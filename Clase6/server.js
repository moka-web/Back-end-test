/*const http = require("http")


const server = http.createServer((req,res)=>{


    res.end("hola mundo dale rey")
})

//servidor levantado y escuchando 
const PORT = 8080

const conectedServer = server.listen(PORT,()=>{
    console.log(` servidor escuchando en el puerto ${conectedServer.address().port}`)
})*/

const express = require("express");
const contenedor = require("../Clase4/Contenedor.js");
const app = express();
const PORT = 8080;

const container = new contenedor("file.txt");





app.get('/', (req, res) => {
    res.send(`<h1>Server con Express<h1>`)
 })
 
app.get('/productos',async (req, res) => {
    const productos = container.getAll();
    res.send(await productos)
})

app.get('/productoRandom',async (req, res) => {
    const ProductoRandom = container.getRandomProduct();
    res.send(await ProductoRandom)
    })
 


const server = app.listen(PORT, ()=>{
    console.log(`escuchando en el puerto ${PORT}`)
})

server.on("error", error => console.log(`Error en servidor ${error}`))

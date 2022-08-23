const express = require("express");
const { Router } = express;
const app = express();
const router = Router();

const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()
const urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use("/api/productos/", router);
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/public', express.static(__dirname + '/public'));
app.use(bodyParser.json())

const contenedor = require("../Clase4/Contenedor.js");
const { json } = require("body-parser");

const container = new contenedor("file.txt")
const PORT = 8080 ;

app.get('/form', (req,res)=>{
    res.sendFile(__dirname + '/index.html')
})

router.get('/', async (req,res)=>{
    const productos = container.getAll()
    res.send( await productos)
})

//con jsonParser funciona desde postman
router.post('/' , urlencodedParser, jsonParser, async (req, res) => {
    const { body } = req;
    
    const idAsignado = await container.save(body);
    res.json({ success: "ok", new: { ...body, id: idAsignado } });
  });

router.get('/:id', async (req,res)=>{
    const { id } = req.params
    const productoId= container.getById(Number(id))
    res.json( await productoId )
})

router.put('/:id',async(req,res)=>{
    const body = req.body;
    const id = Number(req.params.id);
    const productoAcambiar = await container.updateProduct(id,body)
    res.json( productoAcambiar)
})

router.delete('/:id', async (req,res)=>{
    const productoEliminado = await container.deleteById(Number(req.params.id))
    res.json( await productoEliminado)

})

const server = app.listen(PORT, ()=>{
    console.log(`escuchando en el puerto ${PORT}`)
})


server.on('error',(error)=>{console.error('server fails')})


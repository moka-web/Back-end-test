const express = require("express");
const { Router } = express;
const app = express();

const routerProducts = Router();
const routerCarrito = Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });
let isAdmin = true;

app.use("/api/productos/", routerProducts);
app.use("/api/carrito/", routerCarrito);

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/public', express.static(__dirname + '/public'));
app.use(bodyParser.json());

const contenedor = require("./contenedor.js");
const { json } = require("body-parser");

const productos = new contenedor("productos.txt");
const carrito = new contenedor("carrito.txt");

const PORT = 8080 ;



app.all("*", (req, res) => {
    res.json({
      error: -2,
      descripcion: `ruta '${req.url}' método '${req.method}' no implementado`,
    });
});


app.get('/form', (req,res)=>{
    res.sendFile(__dirname + '/index.html')
})

routerProducts.get('/', async (req,res)=>{
    const productsList = await productos.getAll()
    res.send( await productsList)
})

//con jsonParser funciona desde postman urlencodedparser funciona desde el front
routerProducts.post('/',(req, res, next) => {
    if (!isAdmin) {
      res.send({
        error: -1,
        descripcion: "no autorizado",
      });
    } else {
      next();
    }
  } , urlencodedParser, jsonParser, async (req, res) => {
    const { body } = req;
    
    const idAsignado = await productos.save(body);
    res.json({ success: "ok", new: { ...body, id: idAsignado } });
  });

routerProducts.get('/:id', async (req,res)=>{
    const { id } = req.params
    const productoId= await productos.getById(Number(id))
    res.json( productoId )
})

routerProducts.put('/:id',
    (req, res, next) => {
        if (!isAdmin) {
        res.send({
            error: -1,
            descripcion: "no autorizado",
        });
        } else {
        next();
        }
    }, urlencodedParser, jsonParser, async(req,res)=>{
    const {body} = req;
    console.log(body)
    const id = Number(req.params.id);
    
    const productoAcambiar = await productos.updateProduct(id,body)
    res.json( await productoAcambiar)
})

routerProducts.delete('/:id',
(req, res, next) => {
    if (!isAdmin) {
      res.send({
        error: -1,
        descripcion: "no autorizado",
      });
    } else {
      next();
    }
  } 

,async (req,res)=>{
    const productoEliminado = await productos.deleteById(Number(req.params.id))
    res.json(  productoEliminado)

})



//CARRITO

routerCarrito.post('/' , async (req,res) =>{
    let productos = [];
    let timeStamp= Date.now();
    const nuevoCarrito = await carrito.save({timeStamp,productos});
    res.json(nuevoCarrito);
})


routerCarrito.delete('/:id',(req, res, next) => {
    if (!isAdmin) {
      res.send({
        error: -1,
        descripcion: "no autorizado",
      });
    } else {
      next();
    }
  } , async (req,res)=>{

    const id = req.params.id;
    let carritoEliminado = await carrito.deleteById(Number(id));
    res.json(carritoEliminado)
});

routerCarrito.get('/:id/productos' , async (req,res)=>{
    const id = req.params.id;
    const carritoID = await carrito.getById(Number(id)) 
    const productosCarrito = carritoID.productos;
    res.json(productosCarrito)
})

routerCarrito.post('/:id/productos', urlencodedParser, jsonParser,  async (req,res)=>{
    const id = req.params.id;
    const { body } = req
    //console.log(body)

    const productoAgregado = await productos.getById(Number(body.id))
    
    const carritoID = await carrito.getById(parseInt(id));
    const productosCarrito = carritoID.productos;
    productosCarrito.push(productoAgregado);
    //console.log(productosCarrito)
    await carrito.updateProduct(Number(id),{
        productos: productosCarrito
    })

    
    res.json(productosCarrito)

})

routerCarrito.delete('/:id/productos/:id_prod', async (req,res)=>{
  const id = req.params.id;
  const id_prod = req.params.id_prod;

  const carritoID = await carrito.getById(Number(id))
  const productosCarrito = carritoID.productos;
 
  const prodDelete =  productosCarrito.filter(e => e.id !== Number(id_prod))

  await carrito.updateProduct(Number(id),{
    productos: prodDelete
})
  res.json('done')

})





const server = app.listen(PORT, ()=>{
    console.log(`escuchando en el puerto ${PORT}`)
})


server.on('error',(error)=>{console.error('server fails')})
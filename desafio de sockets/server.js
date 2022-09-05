const express = require('express');
const app = express();
const { engine } = require('express-handlebars');
const PORT = 8080;
const contenedor = require('./Contenedor.js')
const container = new contenedor('products.txt')
const chatdb =new contenedor('chat.txt')


const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.set('view engine', 'hbs');
app.set('views', './views');
app.engine(
  'hbs',
  engine({
    extname: '.hbs',
    defaultLayout: 'index.hbs',
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials',
  })
);

let chat = [];
let products = [];


app.get('/', async (req, res) => {
  let productos = await container.getAll()
  let chat = await chatdb.getAll()
 
  res.render('main', { productos , chat });
});


io.on("connection", (socket) => {

  console.log("Usuario Conectado" + socket.id);

  socket.on("producto", async (data) => {
    console.log(data)
    await container.save(data);
    products = await container.getAll();
    io.sockets.emit("producto-row", data);
  });
  socket.on("mensaje", async (data) => {
    await chatdb.save(data);
    chat = await chatdb.getAll();
    io.sockets.emit("chat", chat);
  });
});



const server = httpServer.listen(process.env.PORT || 8080 , () => console.log("SERVER ON"));

server.on('error', (error) => console.log(`Error en servidor ${error}`));
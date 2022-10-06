const express = require("express");
const { engine } = require("express-handlebars");
const normalizr = require("normalizr");
const normalize = normalizr.normalize;
const schema = normalizr.schema;
const denormalize = normalizr.denormalize;
const PORT = 8080;

//cookies
const cookieParser = require('cookie-parser')
const session= require('express-session')
const MongoStore = require('connect-mongo')




const ApiProductosMock = require("./api/productos");

const { chatsDaos: Chats } = require("./src/daos/mainDaos");


const { generarId } = require("./utils/generadorDeIds");
const mongoose = require("mongoose");

//
const chatBD = new Chats();
const apiProductos = new ApiProductosMock();

//
const app = express();
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer);

//
httpServer.listen(process.env.PORT || PORT, () => console.log("SERVER ON"));
httpServer.on("error", (error) => console.log(`Error en el servidor ${error}`));

//
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//configuracion session cookies
app.use(
  session(
      {   
          //store: new filestore({path:"./sessions", ttl:300, retries:0}), //esto es para filestore
          store: MongoStore.create({
              mongoUrl: "mongodb+srv://TomasJuarez:432373427473@cluster0.818d8oc.mongodb.net/test",
              mongoOptions:{
                  useNewUrlParser:true,
                  useUniFiedTopology: true,
              }
          }),
          secret:"secreto",
          resave:false,
          saveUninitialized:false,
          cookie:{maxAge: 600000}

      }
  )
)

app.use(function (req, res, next) {
  //console.log(req.session);
  req.session._garbage = Date();
  req.session.touch();
  return next();
});



// Configuracion del motor HANDLEBARS
app.set("view engine", "hbs");
app.set("views", "./views");
app.engine(
  "hbs",
  engine({
    extname: ".hbs",
    defaultLayout: "index.hbs",
    layoutsDir: __dirname + "/views/layouts",
    partialsDir: __dirname + "/views/partials",
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    },
  })
);

let productos = [];
let chat = [];


//aca deberia ir un middleware para obtener el chat y los productos 
function checkIfIsAdmin (req,res,next){
  try {
    if (!req.session.login) {
        return res.render("formLogin")
    }else{
       
        return next()
    }

} catch (error) {
    
}
}

app.get("/", checkIfIsAdmin, async (req, res) => {  
   let user = req.session.login.user;
   console.log(user)
  chat = await chatBD.getAll();
  let chatParseado = [];
  chat.forEach((item) =>
    chatParseado.push({
      id: item._id.toString(),
      author: item.author,
      text: item.text,
      timestamp: item.timestamp,
    })
  );
  //
  const author = new schema.Entity("authors", {}, { idAttribute: "email" });
  const message = new schema.Entity("messages", {
    author: author,
  });
  const chats = new schema.Entity("chats", { chats: [message] });
  //
  const originalData = { id: "999", chats: [...chatParseado] };
  const dataN = normalize(originalData, chats);
  res.render("form-list-chat", { encodedJson: encodeURIComponent(JSON.stringify(dataN)), user } );
});


app.post('/', async (req,res) =>{
  let {body} = req;
  let user = body.user;
  // console.log(body)
  // console.log(body.user)
  // req.session.user= body.user;
  if(!req.session["login"]){
    req.session["login"]={};
    req.session["login"].user = user
  }
  // console.log(req.session)
  res.redirect('http://localhost:8080/')

})

app.get('/logout', (req,res)=>{
  try {
    req.session.destroy((error)=>{
     if(error){
         return res.json({ status: "Logout ERROR", body: error });
     }
     res.status(200).redirect('http://localhost:8080/')
    })
 } catch (error) {
 }

})


app.get("/api/productos-test", async (req, res) => {
  productos = apiProductos.popular();
  res.render("table-productos", { productos });
});



io.on("connection", (socket) => {
  console.log("Usuario Conectado" + socket.id);
  socket.on("mensaje", async (data) => {
    await chatBD.save({
      ...data,
      author: { ...data.author, id: new mongoose.Types.ObjectId() },
    });
    chat = await chatBD.getAll();
    let chatParseado = [];
    chat.forEach((item) =>
      chatParseado.push({
        id: item._id.toString(),
        author: item.author,
        text: item.text,
        timestamp: item.timestamp,
      })
    );
    //
    const author = new schema.Entity("authors", {}, { idAttribute: "email" });
    const message = new schema.Entity("messages", {
      author: author,
    });
    const chats = new schema.Entity("chats", { chats: [message] });
    //
    const originalData = { id: "999", chats: [...chatParseado] };
    const dataN = normalize(originalData, chats);
    io.sockets.emit("chat", dataN);
  });
});

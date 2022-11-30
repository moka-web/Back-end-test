const express = require("express");
const { engine } = require("express-handlebars");
const normalizr = require("normalizr");
const normalize = normalizr.normalize;
const schema = normalizr.schema;
const {PORT, MPASS,MUSER, mode} = require('./configEnv.js')
const session= require('express-session')
const MongoStore = require('connect-mongo');
const passport = require('passport');
const mongoose = require("mongoose");
//
const { chatsDaos: Chats } = require("./src/daos/mainDaos");
const chatBD = new Chats();
//
const app = express();
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer);

const cluster = require('cluster');
const routerProducts = require("./routes/productsRouter.js");
const cartRouter = require("./routes/cartRouter.js");
const routerRandoms = require("./routes/randoms.js");
const routerInfo = require("./routes/info.js");
const homeRouter = require("./routes/homeRouter.js");
const numOfcpus = require('os').cpus().length;
const initializePassport = require('./config/passport');
const signUpRouter = require("./routes/signUp.js");
const loginRouter = require("./routes/login.js");
const logOutRouter = require("./routes/logOut.js");
//////clusters con forever

if (mode == 'cluster' && cluster.isMaster) {
  console.log('-------cluster-mode----------')
  console.log(`Master ${process.pid} is running`);
  for (let i = 0; i < numOfcpus; i++) {
    cluster.fork();
  }
  cluster.on('exit', (worker, code, signal) => {
    cluster.fork();
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  console.log('----------fork mode--------')
  httpServer.listen(PORT, () => console.log(` worker ${process.pid} server listenin on port ${PORT}`));
  httpServer.on("error", (error) => console.log(`Error en el servidor ${error}`));
  console.log(`Worker ${process.pid} started`);
 }
mongoose.connect(  `mongodb+srv://${MUSER}:${MPASS}@cluster0.818d8oc.mongodb.net/test `,
{ 
  useNewUrlParser: true
})   
.then(() => console.log("Connected to Mongo Atlas"));

app.use(express.static(__dirname + '/public'));
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
          rolling: true,
          resave:true,
          saveUninitialized:false,
          cookie:{maxAge: 86400000,
            httpOnly: false,
            secure: false,}

      }
  )
)
app.use(function (req, res, next) {
  //console.log(req.session);
  req.session._garbage = Date();
  req.session.touch();
  return next();
});


initializePassport(passport);
app.use(passport.initialize());
app.use(passport.session());

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

app.use('/',loginRouter);
app.use('/signUp',signUpRouter);
app.use('/',homeRouter);
app.use('/api/randoms',routerRandoms);
app.use('/api/info',routerInfo);
app.use('/api/productos',routerProducts);
app.use('/api/carrito',cartRouter);
app.use('/logout',logOutRouter);


io.on("connection", (socket) => {
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

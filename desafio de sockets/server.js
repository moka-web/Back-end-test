const express = require("express");
const { engine } = require("express-handlebars");
const normalizr = require("normalizr");
const normalize = normalizr.normalize;
const schema = normalizr.schema;
const denormalize = normalizr.denormalize;
const mimetypes = require('mime-types');
const multer = require('multer');

const storage = multer.diskStorage({
  destination:'uploads/',
  filename: function (req,file,cb){
    cb(null, Date.now() + file.originalname + '.' + mimetypes.extension(file.mimetype) );
  }
})
//`${Date.now()}-${file.originalname}`
const upload = multer({storage:storage})

const {PORT, MPASS,MUSER, oS, nodeV, paTh, processId, folderPath, maxRSS, numOfProcess, mode} = require('./configEnv.js')

//cookies session
const cookieParser = require('cookie-parser')
const session= require('express-session')

const MongoStore = require('connect-mongo')

//encriptar password
const bcrypt= require('bcrypt');

//passport imports
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;


const ApiProductosMock = require("./api/productos");
const { chatsDaos: Chats } = require("./src/daos/mainDaos");

//usarios en mongodb
const Usuarios = require("./src/modelsMDB/schemaUsers")

const { generarId } = require("./utils/generadorDeIds");
const mongoose = require("mongoose");
const { fork } = require("child_process");

//
const chatBD = new Chats();
const apiProductos = new ApiProductosMock();

//
const app = express();
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer);

const cluster = require('cluster');
const routerProducts = require("./routes/productsRouter.js");
const { checkIfIsAdmin } = require("./utils/checkIfIsAdmin.js");
const sendEmail = require("./utils/sendEmail.js");
const cartRouter = require("./routes/cartRouter.js");
const numOfcpus = require('os').cpus().length;

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


//funciones de encriptacion de password 
function isValidPassword(user, password) {
  return bcrypt.compareSync(password, user.password);
}
function createHash(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
}

//configuracion middlewares de passport
passport.use("login",
  new localStrategy((username,password,done)=>{
    Usuarios.findOne({ username }, (err, user) => {
      if (err) return done(err);

      if (!user) {
        console.log("User Not Found with username " + username);
        return done(null, false);
      }

      if (!isValidPassword(user, password)) {
        console.log("Invalid Password");
        return done(null, false);
      }

      return done(null, user);
    })
  })
);

passport.use(
  "signup",
  new localStrategy(
    {
      passReqToCallback: true,
    },
    (req, username, password, done) => {
      console.log(req.body)

      Usuarios.findOne({ username: username }, function (err, user) {
        if (err) {
          console.log("Error in SignUp: " + err);
          return done(err);
        }

        if (user) {
          console.log("User already exists");
          return done(null, false);
        }

        const newUser = {
          username: username,
          password: createHash(password),
          email:req.body.email,
          address:req.body.address,
          age:req.body.age,
          phone:req.body.phone
        };
        Usuarios.create(newUser, (err, userWithId) => {
          if (err) {
            console.log("Error in Saving user: " + err);
            return done(err);
          }

          console.log(user);
          console.log("User Registration succesful");

          sendEmail('mokajua@gmail.com',"Nuevo Registro",JSON.stringify(newUser,null,2))

          return done(null, userWithId);
        });
      });
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  Usuarios.findById(id, done);
});

//

//esto me cagaba el chat!!!!
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




app.get("/", checkIfIsAdmin, async (req, res) => {  
  let user = req.user.username;
  const userID =req.user._id
  console.log(userID)
  //  console.log(user)
  // const user = req.user._id
  // console.log(user)
  //ahora
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

app.get('/signUp',(req,res)=>{
  res.render("formSignUp")
})


app.get('/api/randoms',(req,res)=>{
  try {
    res.status(200).render('random')
  } catch (error) {
    res.status(500).send({error:error.message})
  }
})

app.get('/info',(req,res)=>{
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

app.post('/api/randoms',(req,res)=>{
  try {
    let cant = req.query.cant;
    console.log(cant)
    const random = fork("./utils/randomJS.js")
    random.send({message:"start" ,cant: cant})
    random.on("message",(obj)=>{
    res.json(obj)
   })
} catch (error) {
  res.status(500).send({error: error.message})
}
})


app.post('/signUp',upload.single('photo_url'),passport.authenticate("signup", { failureRedirect: "/failsignup" }),
(req,res)=>{
  const {username} = req.user
  req.session.username = username;
  res.redirect('/')
})


app.post('/', passport.authenticate("login", {failureRedirect:'/failLogin'}), async (req,res) =>{
  res.redirect('/')
})

app.get('/logout', (req,res)=>{
  req.logout();
  res.redirect("/");
})

app.get("/api/productos-test", async (req, res) => {
  productos = apiProductos.popular();
  res.render("table-productos", { productos });
});

//ruta productos y carrito 

app.use('/api/productos',routerProducts);
app.use('/api/carrito',cartRouter);

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

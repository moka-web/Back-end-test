const express = require("express");
const { engine } = require("express-handlebars");
const normalizr = require("normalizr");
const normalize = normalizr.normalize;
const schema = normalizr.schema;
const denormalize = normalizr.denormalize;
const PORT = 8080;
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

app.get("/", async (req, res) => {
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
  res.render("form-list-chat", {
    encodedJson: encodeURIComponent(JSON.stringify(dataN)),
  });
});

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

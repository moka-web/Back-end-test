const express = require('express');
const { checkIfIsAdmin } = require('../utils/checkIfIsAdmin');
const homeRouter = express.Router()
const normalizr = require("normalizr");
const normalize = normalizr.normalize;
const schema = normalizr.schema;
const denormalize = normalizr.denormalize;
const { chatsDaos: Chats } = require("../src/daos/mainDaos");
const chatBD = new Chats();

homeRouter.get("/", checkIfIsAdmin, async (req, res) => {  
    let user = req.user.username;
    const userID =req.user._id
  
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

  module.exports = homeRouter;
// Config Mongo DB Atlas
const mongoose = require("mongoose");

const connectMDB = async () => {
  try {
    const URL =
      "mongodb+srv://TomasJuarez:432373427473@cluster0.818d8oc.mongodb.net/test";
    await mongoose.connect(URL, {
      useNewUrlParser: true,
      useUniFiedTopology: true,
    });
  } catch (error) {
    console.log(error);
  }
};

const disconnectMDB = () => {
  mongoose.disconnect();
};

// config.js
module.exports = {
  PERSIST_CHATS: "./chats/ChatsDaoMongoDb",
  connectMDB,
  disconnectMDB,
};

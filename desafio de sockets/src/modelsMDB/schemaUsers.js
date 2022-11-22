const mongoose = require("mongoose");

const UsuarioSchema = new mongoose.Schema({
  username: { type: String, required: true, max: 100 },
  password: { type: String, required: true, max: 100 },
  email: { type: String, required: true, index: { unique: true } },
  address: { type: String, required: true },
  age: { type: Number, required: true },
  phone: { type: Number, required: true },
  photo_url: { type: String },
  cart_id: { type: mongoose.Schema.ObjectId },

});

const Usuarios = mongoose.model("usuarios", UsuarioSchema);

module.exports = Usuarios;



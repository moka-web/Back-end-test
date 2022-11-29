const { connectMDB, disconnectMDB } = require("../../config");

const logger = require('../../config/winston');

class ContenedorMongoDb {
  constructor(name) {
    this.name = name;
  }

  async save(obj) {
    try {
      await connectMDB();
      const objNuevo = new this.name({ ...obj });  // porque pingo no funca 
      const objCreado = await objNuevo.save();
      // disconnectMDB();
      return objCreado._id;
    } catch (error) {
      logger.error(error);
    }
  }

  async getById(id) {
    try {
      await connectMDB();
      const objEncontrado = await this.name.findById(id);
      // disconnectMDB();
      return objEncontrado;
    } catch (error) {
      logger.error(error);
    }
  
  }

  async getAll() {
    try {
      await connectMDB();
      const objEncontrados = await this.name.find();
      // disconnectMDB();
      return objEncontrados;
    } catch (error) {
      logger.error(error);
    }
  }

  async deleteById(id) {
    try {
      await connectMDB();
      const objEncontrado = await this.name.findById(id);
      await this.name.findByIdAndDelete(id);
      // disconnectMDB();
      return objEncontrado;
    } catch (error) {
      logger.error(error);
    }
  }

  async modify(id, replace) {
    try {
      await connectMDB();
      const objModificado = await this.name.findByIdAndUpdate(id, {
        $set: { ...replace },
      });
      // disconnectMDB();
      return objModificado;
    } catch (error) {
      logger.error(error);
    }
  }
  
}

module.exports = ContenedorMongoDb;

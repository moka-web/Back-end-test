
const logger = require('../../config/winston');

class ContenedorMongoDb {
  constructor(name) {
    this.name = name;
  }

  async save(obj) {
    try {
     
      const objNuevo = new this.name({ ...obj }); 
      const objCreado = await objNuevo.save();
    
      return objCreado._id;
    } catch (error) {
      logger.error(error);
    }
  }

  async getById(id) {
    try {
     
      const objEncontrado = await this.name.findById(id);
    
      return objEncontrado;
    } catch (error) {
      logger.error(error);
    }
  
  }

  async getAll() {
    try {
      
      const objEncontrados = await this.name.find();
    
      return objEncontrados;
    } catch (error) {
      logger.error(error);
    }
  }

  async deleteById(id) {
    try {
      const objEncontrado = await this.name.findById(id);
      await this.name.findByIdAndDelete(id);
      return objEncontrado;
    } catch (error) {
      logger.error(error.message);
    }
  }

  async modify(id, replace) {
    try {
      const objModificado = await this.name.findByIdAndUpdate(id, {
        $set: { ...replace },
      });
      return objModificado;
    } catch (error) {
      logger.error(error);
    }
  }
  
}

module.exports = ContenedorMongoDb;

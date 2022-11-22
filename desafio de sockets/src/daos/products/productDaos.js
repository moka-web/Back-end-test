const ContenedorMongoDb = require('../../contenedores/ContenedorMongoDb');
const {products} = require('../../modelsMDB/schemaProducts')

class ProductsDaoMongoDB extends ContenedorMongoDb {
    constructor() {
        super(products);
    }
}

module.exports = {ProductsDaoMongoDB} ;

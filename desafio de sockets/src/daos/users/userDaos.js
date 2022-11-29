
const Usuarios = require('../../modelsMDB/schemaUsers')
const {schemaProducts} = require('../../modelsMDB/schemaProducts');
const ContenedorMongoDb = require('../../contenedores/ContenedorMongoDb');
const logger = require('../../../config/winston')
 
class UserDaoMongoDB extends ContenedorMongoDb {
    constructor() {
        super(Usuarios);
    }

    getByEmail = async (email) => {
        console.log("entro");
        try {
            const user = await this.name.findOne({ email });
            return user;
        } catch (err) {
            logger.error(err);
        }
    };

    addCart = async (userId, cartId) => {
        try {
            const user = await this.name.findOneAndUpdate({ _id: userId }, { cart_id: cartId });
            return cartId;
        } catch (err) {
            logger.error(err);
        }
    };

    deleteCart = async (id) => {
        try {
            const user = this.name.findOneAndUpdate({ cart_id: id }, { $unset: { cart_id: 1 } });
            return user;
        } catch (e) {
            logger.error(err);
        }
    };
}

module.exports = UserDaoMongoDB;
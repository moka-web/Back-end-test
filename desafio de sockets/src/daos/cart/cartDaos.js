const ContenedorMongoDb = require('../../contenedores/ContenedorMongoDb');

const Cart = require('../../modelsMDB/schemaCart')

class CartDaoMongoDB extends ContenedorMongoDb {
    constructor() {
        super(Cart);
    }

    createCart = async (userId) => {
        try {
            const newCart = await this.save({ user_id: userId })
            return newCart;
        } catch (err) {
            console.error(err)
        }
    };

    deleteCartProduct = async (id, prodId) => {
        let cart;
        try {
            cart = await this.getItemById(id);
            cart.products.id(prodId).remove();
            await cart.save();
        } catch (err) {
            console.error(err)
        }
    };

    getCartByUserId = async (id) => {
        let cart;
        try {
            cart = await this.name.findOne({ user_id: id });
        } catch (err) {
            console.error(err)
        }
        return cart ? cart : undefined;
    };

    addCartProduct = async (id, product) => {
        try {
            console.log(id);
            
            let cart = await this.getById({ _id: id });
            console.log(cart);
            if (!cart.products) cart.products = [];
            cart.products.push(product);
            await cart.save();
            return cart.products
        } catch (err) {
            console.error(err);
            console.log(product)
        }
    };
}

module.exports = CartDaoMongoDB;
const ContenedorMongoDb = require('../../contenedores/ContenedorMongoDb');
const logger = require('../../../config/winston')
const Cart = require('../../modelsMDB/schemaCart');
const { products } = require('../../modelsMDB/schemaProducts');


class CartDaoMongoDB extends ContenedorMongoDb {
    constructor() {
        super(Cart);
    }

    createCart = async (userId) => {
        try {
            const newCart = await this.save({ user_id: userId })
            return newCart;
        } catch (error) {
            logger.error(error)
        }
    };

    deleteCartProduct = async (id, prodId) => {
        try {
            
            let cart = await Cart.findOne({ _id: id })
            let products = cart.products
            let newProds = products.filter(e=>e._id != prodId)
            let newCart = await Cart.findByIdAndUpdate({_id:id},{products:newProds})
           
           return await Cart.findOne({ _id: id })
        } catch (error) {
            logger.error(`deleteCartProduct: ${error.message}`)
        }
    };

    getCartByUserId = async (id) => {
        let cart;
        try {
            cart = await this.name.findOne({ user_id: id });
        } catch (error) {
            logger.error(error)
        }
        return cart ? cart : undefined;
    };

    addCartProduct = async (id, product) => {
        try {
            let cart = await this.getById({ _id: id });
            if (!cart.products) cart.products = [];
            cart.products.push(product);
            await cart.save();
            return cart.products
        } catch (error) {
            logger.error(error)
            logger.info(product)
        }
    };

    modifyProductCart = async(id,prodId,setedProd)=>{
        try {
           await this.name.findOneAndUpdate(
            {"_id":id, "products._id":prodId },
            {"$set": {"products.$.quantity": setedProd.quantity +1}
        
        } )
        } catch (error) {
            logger.error(` modifyProductCart  ${error.message}`)
        }

    }

    deleteByOne= async (id,prodId,prodquant)=>{

    try {
        await this.name.findOneAndUpdate(
        {"_id":id, "products._id":prodId },
        {"$set": {"products.$.quantity": prodquant -1}
    
    } )
    } catch (error) {
       logger.error(` deleteByOne ${error.message}`)
    }}


}

module.exports = CartDaoMongoDB;
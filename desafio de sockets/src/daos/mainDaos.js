const { PERSIST_CHATS } = require("../../config");
const CartDaoMongoDB = require("./cart/cartDaos");
const chatsDaos = require(PERSIST_CHATS);
const {ProductsDaoMongoDB} = require('./products/productDaos')
const UserDaoMongoDB = require('./users/userDaos')



const products =  new ProductsDaoMongoDB();
const users = new UserDaoMongoDB();
const carts = new CartDaoMongoDB()


module.exports = { chatsDaos ,products , users ,carts};

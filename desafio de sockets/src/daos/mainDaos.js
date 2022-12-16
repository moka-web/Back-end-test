
const CartDaoMongoDB = require("./cart/cartDaos");
const chatsDaos = require('./chats/ChatsDaoMongoDb');
const {ProductsDaoMongoDB} = require('./products/productDaos')
const productsDaoFiles = require('./products/ProductsDaoFiles')
const CartDaoFiles= require('./cart/CartDaoFiles')
const UserDaoMongoDB = require('./users/userDaos');
const { persistencia } = require("../../configEnv");


const getPersistency= ()=>{

  const persist = persistencia;
  console.log(process.env.PERSIST)

    switch (persist) {
        case "file":
          return{
            products: new productsDaoFiles('products.json'),
            carts: new CartDaoFiles('carts.json'),
            users: new UserDaoMongoDB(),
            chatBD: new chatsDaos()
          }
        case "mongo" :
            return {
                products: new ProductsDaoMongoDB(),
                users : new UserDaoMongoDB(),
                carts : new CartDaoMongoDB(),
                chatBD : new chatsDaos()
            }  

    }
}

module.exports = getPersistency;

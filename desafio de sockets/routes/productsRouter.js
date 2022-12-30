const express = require('express')
//const productDaos = require('../daos/productDaos.js')
const { checkIfIsAdmin } = require('../utils/checkIfIsAdmin.js');

const { getProducts, getProductById, postProduct, PutProduct, deleteProduct } = require('../controllers/products.js');

const routerProducts = express.Router();
//routerProducts.use(checkIfIsAdmin)

routerProducts.get('/', getProducts);

routerProducts.get('/:id', getProductById);

routerProducts.post('/' , postProduct);

routerProducts.put('/:id', PutProduct);

routerProducts.delete('/:id',deleteProduct);

module.exports = routerProducts;
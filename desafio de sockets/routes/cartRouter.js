const express = require('express');
const { getCart, addAproductToCart, deleteCartById, deleteCartProduct, finishBuying } = require('../controllers/cart');
const { checkIfIsAdmin } = require('../utils/checkIfIsAdmin');
const cartRouter= express.Router();
cartRouter.use(checkIfIsAdmin)


cartRouter.get('/', getCart);
cartRouter.post('/:id/productos/:idprod',addAproductToCart)
cartRouter.delete('/:id',deleteCartById)
cartRouter.delete('/:id/:idprod',deleteCartProduct)
cartRouter.post('/:id/productos', finishBuying)

module.exports= cartRouter;
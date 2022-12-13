const express = require('express');
const { getCart, addAproductToCart, deleteCartById, deleteCartProduct, finishBuying } = require('../controllers/cart');
const { checkIfIsAdmin } = require('../utils/checkIfIsAdmin');
const cartRouter= express.Router();
cartRouter.use(checkIfIsAdmin)

// cartRouter.post('/', async(req,res)=>{
//     if (req.user.cart_id) {
//         return carts.getItemById(req.user.cart_id);}
    
//         const newCartId = await carts.createCart(req.user._id);
//         return res.json(newCartId);
// })

cartRouter.get('/', getCart);
//agregar un producto del listado de productos a un carrito especifico 
cartRouter.post('/:id/:idprod',addAproductToCart)

cartRouter.delete('/:id',deleteCartById)

cartRouter.delete('/:id/:idprod',deleteCartProduct)

cartRouter.post('/:id', finishBuying)

module.exports= cartRouter;
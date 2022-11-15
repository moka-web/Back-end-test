const express = require('express')
//const cartDaos = require('../daos/cartDaos.js')
const {cartDaos:Cart} = require('../daos/mainDaos')

const cartRouter= express.Router();

const cart = new Cart()

cartRouter.post('/', async(req,res)=>{
    try {
        const addCart = cart.newCart();
        res.status(200).send({
            status:200,
            data:{
                addCart
            },
            message:'se creo un nuevo carrito'
        })
    } catch (error) {
        console.log(error.message)
    }
})

cartRouter.get('/:id', (req,res)=>{
    const id = req.params.id;
    try {
        const getCart = cart.getCartById(id)
        res.status(200).send({
            status:200,
            data:{
                getCart
            },
            message:` se encontro el carrito con el id ${id}`  
        })
    } catch (error) {
        console.log(error.message)
        
    }
} );

//agregar un producto del listado de productos a un carrito especifico 

cartRouter.post('/:id/:idprod',(req,res)=>{
    const cartId= req.params.id;
    const idprod=req.params.idprod;
    try {
        const addAproduct = cart.addProductToCart(cartId,idprod)
        res.status(200).send({
            status:200,
            data:{
                addAproduct
            },
            message:'nuevo producto cargado',
        }
        )
    } catch (error) {
        console.log(error.message)
        
    }


})


cartRouter.delete('/:id',( req,res)=>{
    const id = req.params.id;
    try {
        const deleteCart = cart.deleteCart(id);
        res.status(200).send({
            status:200,
            message:`el carrito con id ${id} fue eliminado`
        })
    } catch (error) {
        console.log(error.message)
        
    }

})

cartRouter.delete('/:id/:idprod',async (req,res)=>{
    const cartId = req.params.id;
    const productId= req.params.idprod;
    try {
        const deleteProductoFromCart = await cart.deleteCartProduct(cartId,productId);
        res.status(200).send(
            {
                status:200,
                data:{
                    deleteProductoFromCart
                },
                message:'el producto fue eliminado del carrito'
            }
        )
        
    } catch (error) {
        console.log(error.message)
        
    }
    
    
})


module.exports= cartRouter;
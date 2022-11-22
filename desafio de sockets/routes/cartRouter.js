const express = require('express')
//const cartDaos = require('../daos/cartDaos.js')
//const {cartDaos:Cart} = require('../daos/mainDaos')
//hacer todos los import de main daos como corresponde {cart products user}
const {products, users, carts} = require('../src/daos/mainDaos')

const cartRouter= express.Router();
//esto no va 
//const cart = new Cart()

// hay que reemplazar todos los metodos
cartRouter.post('/', async(req,res)=>{
    if (req.user.cart_id) {
        return carts.getItemById(req.user.cart_id);}
    
        const newCartId = await carts.createCart(req.user._id);
        return res.json(newCartId);
})


// con este veo el carrito 
cartRouter.get('/:id', (req,res)=>{
    const id = req.params.id;
    try {
        const getCart = carts.getById(id)
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
cartRouter.post('/:id/:idprod',async (req,res)=>{
    const cartId= req.params.id;
    const idprod=req.params.idprod;
    
    const product = await products.getById(idprod)
    try {
        const addAproduct = await carts.addCartProduct(cartId,product)
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
        const deleteCart = carts.deleteById(id)
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
        const deleteProductoFromCart = await carts.deleteCartProduct(cartId,productId)
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
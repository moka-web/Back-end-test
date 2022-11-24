const express = require('express')

const {products, users, carts} = require('../src/daos/mainDaos');
const { checkIfIsAdmin } = require('../utils/checkIfIsAdmin');
const sendEmail = require('../utils/sendEmail');
const sendSms = require('../utils/sendSms');
const sendWhatsapp = require('../utils/sendWathsapp');

const cartRouter= express.Router();
//esto no va 
//const cart = new Cart()
cartRouter.use(checkIfIsAdmin)

// hay que reemplazar todos los metodos capaz que desde aca termino el circuito del carro 
// cartRouter.post('/', async(req,res)=>{
//     if (req.user.cart_id) {
//         return carts.getItemById(req.user.cart_id);}
    
//         const newCartId = await carts.createCart(req.user._id);
//         return res.json(newCartId);
// })


cartRouter.post('/:id', async(req,res)=>{
    
    const cart = await carts.getById(req.params.id)
       

    await sendEmail('mokajua@gmail.com',
    `Nuevo pedido de ${req.user.username} - ${req.user.email}`,
    JSON.stringify(cart.products)
    )

    const newUser = await users.deleteCart(cart._id);
    console.log(newUser)

    await sendSms('se registro una nueva orden');
    await sendWhatsapp('se registro una nueva orden')
    
    res.redirect('/')
})


// con este veo el carrito 
cartRouter.get('/', async (req,res)=>{
    //traigo el id del carrito del user 
    
    try {
        const user = await users.getById(req.user._id);
        const sanitizedUser = { name: user.username, photo_url: user.photo_url, _id: user._id, cart_id: user.cart_id }

        const getCart =await carts.getById(sanitizedUser.cart_id)
        const cartid = getCart._id;

        const allProducts = await getCart.products.map((product) => ({
            name: product.name,
            photo_url: product.photo_url,
            description: product.description,
            price: product.price,
            _id:JSON.stringify(product._id)
        }));
            
            res.render('cartProducts',{allProducts,sanitizedUser,cartid})
        
    } catch (error) {
        console.log(error)
        
    }
} );

//agregar un producto del listado de productos a un carrito especifico 
cartRouter.post('/:id/:idprod',async (req,res)=>{
    const cartId= req.params.id;
    const idprod=req.params.idprod;
    
    const product = await products.getById(idprod)
    try {
        const addAproduct = await carts.addCartProduct(cartId,product)
        res.sendStatus(200)
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
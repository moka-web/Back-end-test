const express = require('express')
//const productDaos = require('../daos/productDaos.js')

const { checkIfIsAdmin } = require('../utils/checkIfIsAdmin.js');

const {products, users, carts} = require('../src/daos/mainDaos');

const routerProducts = express.Router();
//routerProducts.use(checkIfIsAdmin)

routerProducts.get('/', async (req,res) =>{

    const idUser = req.user._id;
    const user = await users.getById(idUser)

    const sanitizedUser = { name: user.username, photo_url: user.photo_url, _id: user._id, cart_id: user.cart_id }
    
    console.log(sanitizedUser)
    //tengo que traer el carrito
    if(!sanitizedUser.cart_id ){
        const res = await carts.createCart(idUser); 
        console.log(res)
        const cartId = await users.addCart(idUser,res._id);
       console.log(cartId)
    }




    try {
        const productos = await products.getAll()
        res.status(200).render('table-productos', { productos , sanitizedUser })
    }
    catch (error) {
        res.status(500).send({
            status: 500,
            message: error.message
        })
    }

});

routerProducts.get('/:id', async (req,res) =>{

    const prod = new Product()
    const id = req.params.id;
        try {
            const product_id = await prod.getById(id)

            res.status(200).send({
                status: 200,
                data: {
                    product_id,
                },
                message:'producto encontrado'
                })
        }
            
        catch (error) {
            res.status(500).send({
                status: 500,
                message: error.message
            })
        }
    
    
    
    });



routerProducts.post('/' , function(req,res,next){

    if (req.query.admin ==  1) {
        console.log(` admnin ${req.query.admin} is connected`)
                
        next()
    } else {
        res.send({ error: "No admin"})
    }

}, async (req,res) =>{
        const body = req.body;
        console.log(body)
       
            try {
                
                const newProd = await products.save(body);
            
                res.status(200).send({
                status: 200,
                data: {
                    newProd,
                },message:'producto cargado'})

            } catch (error) {
                console.log(error.message)
                
        }

});

routerProducts.put('/:id', function (req,res,next){
    
    if (req.query.admin ==  1) {
        console.log(` admnin ${req.query.admin} is connected`)
        next()
    } else {
        res.send({ error: "No admin"})
    }

}, async (req,res) =>{
    const id = req.params.id;
    const body = req.body;
    try {
        const prod = new Product()
        const updatedproduct= await prod.update( id , body )
        res.status(200).send({
            status: 200,
            data: {
                updatedproduct,
            },message:'producto cargado'})
        
    } catch (error) {
        console.log(error.message)
        
    }
}
 );

routerProducts.delete('/:id',function (req,res,next){
    
    if (req.query.admin ==  1) {
        console.log(` admnin ${req.query.admin} is connected`)
        next()
    } else {res.send({ error: "No admin"})}
    
    }, async (req,res)=>{
        const id = req.params.id;
        try {
            const prod = new Product();
            const deleted = await prod.deleteOne(id);
            res.status(200).send({
                status: 200,
                data: {
                    deleted,
                },message:'producto eliminado'})
            
        } catch (error) {
            console.log(error.message)
        }
    });



module.exports = routerProducts;
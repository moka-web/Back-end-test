const {products, users, carts} = require('../src/daos/mainDaos')();
const logger = require('../config/winston.js');


async function getProducts (req,res){
    const idUser = req.user._id;
    const user = await users.getById(idUser)
   
    const sanitizedUser = { name: user.username, photo_url: user.photo_url, _id: user._id, cart_id: user.cart_id }
    console.log(sanitizedUser)
    
    if (process.env.PERSIST !== "file") {
        if(!sanitizedUser.cart_id ){
            console.log('entra ')
            const res = await carts.createCart(idUser); 
            const cartId = await users.addCart(idUser,res._id);
           console.log(cartId)
        }
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
}


async function getProductById (req,res){
    const id = req.params.id;
    try {
        const product_id = await products.getById(id)

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

}

async function postProduct (req,res){
    if (req.query.admin ==  1) {
        logger.info(` admnin ${req.query.admin} is connected`)
        const body = req.body; 
        try {
            
            const newProd = await products.save(body);
        
            res.status(200).send({
            status: 200,
            data: {
                newProd,
            },message:'producto cargado'})

        } catch (error) {
            logger.error(error)}
        } 
        else {
        res.send({ error: "No admin"})
} 

}

async function PutProduct (req,res){
     
    if (req.query.admin ==  1) {
        console.log(` admnin ${req.query.admin} is connected`)
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

    } else {
        res.send({ error: "No admin"})
    }


}

async function deleteProduct (req,res){

    if (req.query.admin ==  1) {
        logger.info(` admnin ${req.query.admin} is connected`)
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
       
            logger.error(error)
        }
        
    } else {res.send({ error: "No admin"})}
}


module.exports = {getProducts,getProductById,postProduct,PutProduct,deleteProduct}
//@ts-check

const express = require('express')
//const productDaos = require('../daos/productDaos.js')
const {Product} = require('../src/contenedores/productDaos.js');
const { checkIfIsAdmin } = require('../utils/checkIfIsAdmin.js');

const routerProducts = express.Router();


routerProducts.get('/',checkIfIsAdmin, async (req,res) =>{

    try {
        const prod = new Product();
        const productos = await prod.getAll()
        res.status(200).render('table-productos', { productos })
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
                const prod =  new Product();
                const newProd = await prod.save(body);
            
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
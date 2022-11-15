const mongoose = require('mongoose');
const productSchema = require('../modelsMDB/schemaProducts');

class Product {

    async connectMdb () {
        try {
            return await mongoose.createConnection("mongodb+srv://TomasJuarez:432373427473@cluster0.818d8oc.mongodb.net/test", { useNewUrlParser: true });
          } catch (error) {
            console.log(error.message);
          }
    }

    
    async save(producto) {
        try {
            let tiempo = new Date()
            await this.connectMdb()
            producto.timestamp = tiempo.toString()
            await productSchema.create(producto)
            const id = producto._id
            mongoose.disconnect()
            return id
        } catch (error) {
            throw Error(error.message)
        }
    }



    async getAll (){
        try {
            const db = await this.connectMdb();
            if (!db) throw 'can not connect to the db';
            const products = await productSchema.find({})
            return products
        } catch (error) {
            console.error(error.message)
            
        }

    }


    async getById (id){
        try {
            const db = await this.connectMdb();
            if (!db) throw 'can not connect to the db';
            const product_id= await productSchema.findById(id)
            return product_id
            
        } catch (error) {
            console.error(error.message)
            
        }
    }
    // 

    async update (id,modify){
        

        try {
            const db = await this.connectMdb()
            if(!db) throw'cannot connect';
            const updatedProd = await productSchema.updateOne( {_id:id},{$set:modify})
            mongoose.disconnect
            return updatedProd;
            
        } catch (error) {
            console.log(error.message)            
        }

    };


    async deleteOne (id){
        try {
            const db = await this.connectMdb();
            if(!db) throw 'cannot conect';
            const deleteOne = await productSchema.findByIdAndDelete(id)
            mongoose.disconnect
            return deleteOne;

        } catch (error) {
            console.log(error.message)
        }
    }








   
}

module.exports ={ Product};
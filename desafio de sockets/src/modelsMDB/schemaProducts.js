
const mongoose = require('mongoose')


const productSchema= new mongoose.Schema({
    name:{ type: String, required: true},
    price:{type:Number,required:true},
    stock:{type:Number,required:true},
    photo_url:{type:String,required:true},
    description: {type: String, require: true},
    
},
 { timestamps: true }
)

const products = mongoose.model('products',productSchema)
module.exports = {products , productSchema};



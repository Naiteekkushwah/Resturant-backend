const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    image: {
    data: Buffer,          // file का binary data
    contentType: String ,  // file का mime type (जैसे 'image/png')
  },
    name:String,
    price:Number,
    discount:{
        type:Number,
        default:0
    },
     isNewCollection: Boolean, // true for new collection 
     stock:Number,    
    
})
const product = mongoose.model('product',productSchema)

module.exports=product
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productname: {
    type: String,
    required: false
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  offerprice: {
    type: Number,
    required: true
  },
  stock: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  images: [{
    type:String
  }],
  coverImage:{
    type:String
  },
  delete:{
    default:false,
    type:Boolean,
  }
});

const Products = mongoose.model('Product', productSchema);
module.exports = Products;

const mongoose=require('mongoose')

const cartSchema = new mongoose.Schema({
    products: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Products',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            default: 1
        },
        offerprice:{
            type:Number
        }
    }],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Userinfo',
        required: true
    },
    Discount:{
        type:Number,
        default:0,
    }
});

const cart = mongoose.model('cart', cartSchema);
module.exports = cart;
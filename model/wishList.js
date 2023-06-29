const mongoose=require('mongoose')

const wishListSchema = new mongoose.Schema({
    products: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Products',
            required: true
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
    total:{
        type:Number,
        default:0,
    }
});

const wishList = mongoose.model('WishList', wishListSchema);
module.exports = wishList;
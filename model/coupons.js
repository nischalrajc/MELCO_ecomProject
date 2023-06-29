const mongoose=require('mongoose')

const couponSchema= new mongoose.Schema({
    couponCode:{
        type:String,
        required:true
    },
    minLimit:{
        type:Number,
        required:true
    },
    discountPercentage: {
        type: Number,
        required: true
      },
    expireDate:{
        type: Date,
        required: true
    }
})

const coupon=mongoose.model('Coupon',couponSchema);
module.exports=coupon;
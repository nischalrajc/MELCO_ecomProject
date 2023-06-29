const mongoose=require('mongoose')

const orderSchema= new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Userinfo',
        required: true
    },
    deliveryDetails:{
        firstname:{type:String,required:true},
        lastname:{type:String,required:true},
        state:{type:String,required:true},
        district:{type:String,required:true},
        city:{type:String,required:true},
        place:{type:String,required:true},
        address:{type:String,required:true},
        phone:{type:String,required:true},
    },
    paymentMethode:{type:String,required:true},
    products:[{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Products',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
        },
        currentPrice:{
            type:Number,
            required:true
        },
    }],
    paymentStatus:{type:String,required:true},
    deliveryStatus:{type:String},
    discount:{type:Number},
    totalamount:{type:Number,required:true},
    orderDate:{type:Date,default:Date.now}

})

const order=mongoose.model('orders',orderSchema)
module.exports=order

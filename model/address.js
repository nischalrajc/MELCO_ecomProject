const mongoose=require('mongoose')

const addressSchema=new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Userinfo',
        required: true
    },
    address: [{
        firstname:{
            type:String,
            required:true
        },
        lastname:{
            type:String,
            required:true
        },
        address:{
            type:String,
            required:true
        },
        place:{
            type:String,
            required:true
        },
        city:{
            type:String,
            required:true
        },
        district:{
            type:String,
            required:true
        },
        state:{
            type:String,
            required:true
        },
        pincode:{
            type:String,
            required:true
        },
        phone:{
            type:String,
            required:true
        },
    }],
})

const address = mongoose.model('address', addressSchema);
module.exports = address;
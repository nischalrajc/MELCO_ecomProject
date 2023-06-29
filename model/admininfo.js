const mongoose=require('mongoose')

const adminSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    phone_number:{
        type:Number,
        required:true,
    },
    password:{
        type:String,
        required:true,
    }
})

const admin = mongoose.model('admin', adminSchema);
module.exports = admin;
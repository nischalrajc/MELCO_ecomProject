const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({
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
    },
    blocked:{
        type:Boolean,
        required:true,
    }
})

const User = mongoose.model('User', userSchema);
module.exports=User;
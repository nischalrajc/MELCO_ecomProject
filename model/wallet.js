const mongoose=require('mongoose')

const walletSchema= new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Userinfo',
        required: true
    },
    amount:{
        type:Number,
    }
})

const Wallet=mongoose.model('Wallet',walletSchema);
module.exports=Wallet;
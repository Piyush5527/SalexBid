const mongoose = require('mongoose')
const transaction = new mongoose.Schema(
    {
        user_id : {type : mongoose.Schema.Types.ObjectId, ref : 'auth_users'},
        t_id : {type : String,required: true},
        amount : {type : Number,required: true},
        reason : {type : String,required: true},
        refund_available : {type:Boolean,required:true,default:false},
        refund_done:{type:Boolean,required: true,default:false},
        product_id : {type : mongoose.Schema.Types.ObjectId, ref : 'bids'},
        created_at : {type : Date, default : Date.now},
        updated_at : {type : Date, default : Date.now}
    },
    {collection : 'user_addresses'}
);
const transactionDB = mongoose.model('transaction',transaction)
module.exports = transactionDB
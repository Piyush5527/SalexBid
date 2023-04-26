const mongoose = require('mongoose')
const history = new mongoose.Schema(
    {
        user_id : {type: mongoose.Schema.Types.ObjectId,ref:'auth_user'},
        prod_image:{type:String,required :true},
        product_name:{type:String,required :true},
        amount : {type:Number,required:true},
        user_name:{type:String,required:true},
        payment_done : {type:Boolean,default:false},
        payment_status:{type:String,required:true},
        created_at : {type : Date, default : Date.now},
        updated_at : {type : Date, default : Date.now}

    },
    {collection:'bid_history'}
);
const HistoryDB = mongoose.model('bid_history',history)
module.exports =HistoryDB
const mongoose = require('mongoose')
const winner =new mongoose.Schema(
    {
        user_id:{type: mongoose.Schema.Types.ObjectId,ref:'auth_user'},
        bid_id:{type: mongoose.Schema.Types.ObjectId,ref:'bid_history'},
        prod_image : {type : String, required:true},
        amount : {type : Number,required :true},
        payment_status : {type : Boolean, default:false},
        product_name : {type : String ,required:true},
        created_at : {type : Date, default : Date.now},
        updated_at : {type : Date, default : Date.now}
    },
    {collection:'bid_winner_details'}
);
const WinnerDB =mongoose.model('bid_winner_details',winner)
module.exports=WinnerDB;
const mongoose = require('mongoose')
const detail=new mongoose.Schema(
    {
        product_id:{type: mongoose.Schema.Types.ObjectId , ref:'bids'},
        user_id:{type: mongoose.Schema.Types.ObjectId,ref:'auth_users'},
        amount:{type: Number, required: true},
        lastbid:{type: Date, required: true},
        accept_status:{type:Boolean, required: true},
        created_at : {type : Date, default : Date.now},
        updated_at : {type : Date, default : Date.now}
    },
    {collection: 'bidjoined'}
);
const bidJoinedDB=mongoose.model('bidjoined',detail)
module.exports = bidJoinedDB
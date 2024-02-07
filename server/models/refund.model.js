const mongoose = require('mongoose')
const refund = new mongoose.Schema({
    user_id : {type: mongoose.Schema.Types.ObjectId,ref:'auth_users'},
    refund_status :{type:Boolean, default:false},
    created_at : {type : Date, default : Date.now},
    updated_at : {type : Date, default : Date.now}
    },
    {collection:'refund'}
);
const RefundDB=mongoose.model('refund',refund)
module.exports = RefundDB


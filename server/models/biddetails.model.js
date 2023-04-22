const mongoose = require('mongoose')
const Bids=new mongoose.Schema(
    {
        product_name: {type : String, required: true},
        product_category: {type : String, required: true},
        base_price: {type: Number, required: true},
        short_desc:{type: String, required: true},
        long_desc:{type: String, required: true},
        start_date:{type: Date, required: true},
        u_id: {type : mongoose.Schema.Types.ObjectId, ref : 'auth_users'},
        allowed: {type: Boolean, default: false, required: true},
        image_name: {type: String, required: true},
        created_at : {type : Date,  default : Date.now},
        updated_at : {type : Date,  default : Date.now}
    },
    {collection:'bids'}
);

const biddata= mongoose.model('bids',Bids);
module.exports = biddata;
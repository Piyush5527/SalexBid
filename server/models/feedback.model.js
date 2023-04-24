const mongoose = require('mongoose')

const Feedback = new mongoose.Schema(
    {
        product_id : {type : mongoose.Schema.Types.ObjectId, ref : 'products'},
        user_id : {type : mongoose.Schema.Types.ObjectId, ref : 'auth_users'},
        feedback : {type : String, required : true},
        created_at : {type : Date, default:Date.now},
        updated_at : {type : Date, default:Date.now}
    }, 
    {collection : 'user_feedbacks'}
);

const feedbackdb = mongoose.model('user_feedbacks', Feedback)

module.exports = feedbackdb
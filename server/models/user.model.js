const mongoose = require('mongoose')

const User = new mongoose.Schema(
    {
        full_name : {type : String, required : true},
        phone : {type: String, required : true, maxLength : 10},
        email : {type : String, required : true, unique : true},
        password : {type : String, required : true},
        address : {type : String, required : true},
        gender : {type : String, required : true},
        tokens :[{
            token :{
                type : String,
                required : true,
            }
        }],
        verification_proof : {type : String, required : true},
        created_at : {type : Date, required : true},
        updated_at : {type : Date, required : true},
    }, 
    {collection : 'auth_users'}
);

const userdb = mongoose.model('auth_users', User)

module.exports = userdb
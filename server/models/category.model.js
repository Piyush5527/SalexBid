const mongoose=require('mongoose')
const Category=new mongoose.Schema(
    {
        category_name:{type:String, required:true},
        created_at:{type : Date,default:Date.now},
        updated_at:{type : Date,default:Date.now}
    },
    {collection:'category'}
);
const category_db=mongoose.model('category',Category);
module.exports=category_db
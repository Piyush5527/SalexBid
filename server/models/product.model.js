const mongoose=require('mongoose')
const Product=new mongoose.Schema(
    {
        category_id:{type:mongoose.Schema.Types.ObjectId,ref:'category'},
        product_name:{type:String,required:true},
        product_price:{type:Number,required:true,default:0},
        short_desc:{type:String,required:true},
        long_desc:{type:String,required:true},
        prod_size:{type:String,required:true},
        prod_stock:{type:Number,required:true,min:0},
        prod_image:{type : String},
        created_at:{type : Date,default:Date.now},
        updated_at:{type : Date,default:Date.now}
    },
    {collection:'products'}
);

const prod_db = mongoose.model('products',Product)
module.exports = prod_db
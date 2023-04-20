const express = require("express")
const jwt = require("jsonwebtoken")
const cors = require("cors")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const crypto = require("crypto")
const Razorpay = require("razorpay")
const multer = require('multer')
const bcrypt=require("bcrypt")
const fs = require('fs')
const Product=require('./models/product.model');
const Category=require('./models/category.model');
const Address=require('./models/address.model');
const Cart = require('./models/cart.model');
const Order = require('./models/order.model');
const FinalOrder = require('./models/final_order.model');

const { application } = require("express")

const Skey = "jujutsukaisengojoyujiandmanymore"


const User = require('./models/user.model')

const razorpay_key_id = "rzp_test_2TuO5NUvU21p95"
const razorpay_secret_key = "S0A6zi0OqqbyF4MF5PYI04Cz"

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/salexbid');

const razorpayInstance = new Razorpay({
  
    // Replace with your key_id
    key_id: "rzp_test_2TuO5NUvU21p95",
  
    // Replace with your key_secret
    key_secret: "S0A6zi0OqqbyF4MF5PYI04Cz"
});

var currentAddressId = null;

app.post("/api/checkout/:id", async (req, res) => {
    try {
    
        const {id} = req.params;

        currentAddressId = id;

        const rootAddress = await Address.findOne({_id : id});

        const token =  req.headers.authorization;
        const verifytoken = jwt.verify(token, Skey)
        //console.log(verifytoken);
        const rootUser = await User.findOne({_id:verifytoken._id})

        const cartItems = await Cart.find({user_id : rootUser._id}).populate('product_id user_id')

        var totalCartAmount = 0;

        if(cartItems){
            for(var i=0; i<cartItems.length; i++) {
                totalCartAmount+=cartItems[i].total_amount;
            }

            const options = {
                amount : totalCartAmount*100,
                currency : "INR",
            };

            const order = await razorpayInstance.orders.create(options)
            res.status(200).json(order)
        }

        

    } catch (err) {
        console.log(err)
        res.status(401).json(err)
    }
});

app.post("/api/paymentverification", async (req, res) => {
    try {
        console.log("In Payment Verification")
        console.log("Payment Id : ",req.body)

        const token =  req.headers.authorization;
        const verifytoken = jwt.verify(token, Skey)
        //console.log(verifytoken);
        const rootUser = await User.findOne({_id:verifytoken._id})

        const cartItems = await Cart.find({user_id : rootUser._id}).populate('product_id user_id')

        let body=req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id;
        var expectedSignature = crypto.createHmac('sha256', 'S0A6zi0OqqbyF4MF5PYI04Cz')
                                        .update(body.toString())
                                        .digest('hex');
        console.log("sig received " ,req.body.razorpay_signature);
        console.log("sig generated " ,expectedSignature);
        if(expectedSignature === req.body.razorpay_signature){
            console.log("Signature Matched")
            
            const orderCreation = await Order.create({
                user_id : rootUser._id,
                address_id  :  currentAddressId,
                payment_status : "Success",
                payment_mode : "Online"
            });

            orderCreation.save()

            if(orderCreation) {
                const orders = await Order.find({user_id : rootUser._id})
                for(var i=0; i<cartItems.length; i++) {
                    const finalOrderCreation = await FinalOrder.create({
                        user_id : rootUser._id,
                        order_id : orders[orders.length-1]._id,
                        product_id : cartItems[i].product_id,
                        quantity : cartItems[i].qty,
                        total : cartItems[i].total_amount
                    });

                    finalOrderCreation.save();

                    await Cart.findByIdAndDelete({ _id: cartItems[i]._id })
                }
            }
            res.status(200).json({reference : req.body.razorpay_payment_id})
        } else {
            res.status(401).json("Error")
        }
    
    } catch (err) {
        console.log(err)
        res.status(401).json(err)
    }
});

app.post("/api/checkoutbycod/:id", async (req, res) => {
    try {
        const {id} = req.params
        const token =  req.headers.authorization;
        const verifytoken = jwt.verify(token, Skey)
        //console.log(verifytoken);
        const rootUser = await User.findOne({_id:verifytoken._id})

        const cartItems = await Cart.find({user_id : rootUser._id}).populate('product_id user_id')

            
            const orderCreation = await Order.create({
                user_id : rootUser._id,
                address_id  :  id,
                payment_status : "Pending",
                payment_mode : "COD"
            });

            orderCreation.save()

            if(orderCreation) {
                const orders = await Order.find({user_id : rootUser._id})
                for(var i=0; i<cartItems.length; i++) {
                    const finalOrderCreation = await FinalOrder.create({
                        user_id : rootUser._id,
                        order_id : orders[orders.length-1]._id,
                        product_id : cartItems[i].product_id,
                        quantity : cartItems[i].qty,
                        total : cartItems[i].total_amount
                    });

                    finalOrderCreation.save();

                    await Cart.findByIdAndDelete({ _id: cartItems[i]._id })
                }
            }
            res.status(200).json("Order is Placed")
        
    
    } catch (err) {
        console.log(err)
        res.status(401).json(err)
    }
});

app.get("/api/getmyorders", async (req, res) => {
    try {
        const token =  req.headers.authorization;
        const verifytoken = jwt.verify(token, Skey)
        
        const rootUser = await User.findOne({_id:verifytoken._id})

        const myOrders = await FinalOrder.find({user_id : rootUser._id}).populate('product_id order_id user_id')

        res.status(200).json(myOrders);
    } catch (err) {
        console.log(err)
        res.status(401).json(err)
    }
});

app.get("/api/getallmyorders", async (req, res) => {
    try {
    
        const myOrders = await FinalOrder.find().populate('product_id order_id user_id')

        res.status(200).json(myOrders);
    } catch (err) {
        console.log(err)
        res.status(401).json(err)
    }
});

app.get("/api/getmyorderid/:id", async (req, res) => {
    try {
        const {id} = req.params


        const token =  req.headers.authorization;
        const verifytoken = jwt.verify(token, Skey)
        
        const rootUser = await User.findOne({_id:verifytoken._id})

        const myOrder = await FinalOrder.findById(id).populate('product_id user_id');

        const myOrderDetails = await Order.findById(myOrder.order_id).populate('address_id')
        console.log(myOrder);
        console.log(myOrderDetails);
        res.status(200).json({Order : myOrder, OrderDetails : myOrderDetails});
    } catch (err) {
        console.log(err)
        res.status(401).json(err)
    }
});

const multerStorage = multer.diskStorage({
    destination : function (req, file, callback) {
        var dir = "./idProof";
        callback(null, dir);
    },

    filename : function(req, file, callback){
        callback(null, file.originalname);
    }
});

const multerFilter = (req, file, cb) => {
    if (file.mimetype.endsWith("image")) {
      cb(null, true);
    } else {
      cb("Please upload only images.", false);
    }
  };    

//var uploadImage = multer({storage : storage});

const upload = multer({
    storage: multerStorage
    //fileFilter: multerFilter
});

app.post('/api/register', upload.single("verification_proof"), async (req, res) => {
    console.log(req.body);
    const {filename} = req.file;
    let encPass=""
    try {
        await bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(req.body.password,salt,function(err,hash){
                encPass=hash
                console.log(encPass)

                User.create({
                    full_name : req.body.fullname,
                    phone : req.body.phone,
                    email : req.body.email,
                    password : encPass,
                    address : req.body.address, 
                    verification_status: false,
                    gender : req.body.gender,
                    verification_proof : filename,
                    created_at : new Date(),
                    updated_at : new Date(),
                })
                
            })
    })
        return res.json({status : 'ok'})
    } 
    catch (err) {
        console.log(err)
        return res.json({status : 'error'})
    }
    return res.json({status : 'ok'});
})

//Login

async function comparePassword(plaintextPassword, hash) {
    const result = await bcrypt.compare(plaintextPassword, hash);
    return result;
}

app.post('/api/login', async (req, res) => {
    console.log(req.body.email,req.body.password);
    const user1 = await User.findOne({
        email : req.body.email, 
        // password : req.body.password, 
    })
    if(user1 !== null)
    {
        console.log("test:",user1);
        passwordMatch=await comparePassword( req.body.password,user1.password)
        
        if(user1 && passwordMatch) {
            const token = jwt.sign({
                // name : user.name,
                _id : user1._id,
                
            }, Skey,
            {expiresIn : "1d"});
            
            user1.tokens = user1.tokens.concat({token:token})
            await user1.save()
            
        
            return res.json({ status : 'ok', user : token})
        }else {
            return res.json({ status : 'error', user : false})
        }
    }
    else{
        return res.json({status:'nouser', user : false});
    }
    
})
app.use("/idProof",express.static("./idProof"));

//EndLogin
//addProduct
app.post('/api/addProduct',upload.single('prodimage'),async(req,res)=>{
   
    const {filename}=req.file;
    console.log(filename)
    try{
        const addProd=await Product.create({
            product_name : req.body.prodname,
            product_price : req.body.prodprice,
            prod_size : req.body.prodsize,
            prod_stock : req.body.prodstock,
            prod_image : filename,
            short_desc : req.body.shortdesc,
            long_desc : req.body.longdesc,
            category_id:req.body.categoryid
        })
        console.log(addProd)
        console.log("Product Added Successfully")
        res.status(201).json(addProd)
    }
    catch(err)
    {
        console.log(err)
        res.status(422).json("Error")
    }
})
app.get('/api/getproducts',async(req,res)=>{
    try{
        const productdata=await Product.find();
        res.status(201).json(productdata);
    }
    catch(err)
    {
        console.log(err)
        res.status(422).json(err)
    }
})

app.post("/api/addtocart/:productId", async (req, res)=>{
    try{
        const {productId} = req.params
        console.log(productId)
        const token =  req.headers.authorization;
        console.log(token)
        const verifytoken = jwt.verify(token, Skey)
        
        const rootUser = await User.findOne({_id:verifytoken._id})
       
        const rootProduct = await Product.findOne({_id:productId})
       
        const currentCart = await Cart.findOne({product_id : productId, user_id : rootUser._id});

        if(!currentCart){
            const addToCart = await Cart.create({
                product_id : productId,
                user_id : rootUser._id,
                qty : 1,
                total_amount : rootProduct.product_price
            })

            console.log(addToCart)
            console.log("Product Added to Cart Successfully")
            return res.status(201).json(addToCart)
        } else {
            const updateCart = await Cart.updateOne({product_id : productId, user_id : rootUser._id},
                {qty : currentCart.qty+1, total_amount : (currentCart.qty+1)*rootProduct.product_price});

            console.log(updateCart)
            console.log("Product Updated in Cart Successfully")
            return res.status(201).json(updateCart)
        }
        
        
        
        
    } catch (err){
        console.log(err)
    }
});

app.get("/api/getcartitems", async (req, res)=>{
    try{
        const token =  req.headers.authorization;
        
        const verifytoken = jwt.verify(token, Skey)
        
        const rootUser = await User.findOne({_id:verifytoken._id})

        const cartItems = await Cart.find({user_id : rootUser._id}).populate('product_id user_id')

        console.log(cartItems.length)

        res.status(201).json(cartItems)

    }catch(err){
        console.log(err)
        res.status(401).json(err)
    }
});

app.delete("/api/deletefromcart/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const deletecart = await Cart.findByIdAndDelete({ _id: id })
        // console.log(deletcategory);
        res.status(201).json(deletecart);

    } catch (error) {
        res.status(422).json(error);
    }
});

app.post('/api/minuscartitem/:id', async (req, res) => { 
    try {
       
        const {id} = req.params

        console.log(id)

        const currentCart = await Cart.findById(id);

        if(currentCart.qty!==1){

            const cartQtyUpdate = await Cart.findByIdAndUpdate(id, {qty : (currentCart.qty-1), total_amount : currentCart.total_amount-(currentCart.total_amount/currentCart.qty)}, {
                new : true
            });
        
            res.status(201).json(cartQtyUpdate)
        } else {
            res.status(401).json("Error Found")
        }
    } 
    catch (err) {
        console.log(err)
        res.status(401).json("Error Found")
    }
})

app.post('/api/pluscartitem/:id', async (req, res) => { 
    try {
        const {id} = req.params

        console.log(id)

        const currentCart = await Cart.findById(id);

        const cartQtyUpdate = await Cart.findByIdAndUpdate(id, {qty : (currentCart.qty+1), total_amount : currentCart.total_amount+(currentCart.total_amount/currentCart.qty)}, {
            new : true
        });

        res.status(201).json(cartQtyUpdate)
    } 
    catch (err) {
        console.log(err)
        res.status(401).json("Error Found")
    }
});

app.get("/api/getaddress", async (req, res)=>{
    try{
        const token =  req.headers.authorization;
        
        const verifytoken = jwt.verify(token, Skey)
        
        const rootUser = await User.findOne({_id:verifytoken._id})

        console.log(rootUser.first_name)

        const userAddress = await Address.find({user_id : rootUser._id})

        console.log(userAddress)

        res.status(201).json(userAddress)

    }catch(err){
        console.log(err)
        res.status(401).json(err)
    }
});

app.get("/api/getaddressid/:id", async (req, res)=>{
    try{
        const {id} =  req.params;

        const userAddress = await Address.findById(id)

        console.log(userAddress)

        res.status(201).json(userAddress)

    }catch(err){
        console.log(err)
        res.status(401).json(err)
    }
});

app.post('/api/addaddress', async (req, res) => {
   
    try {
       
        const token =  req.headers.authorization;
        
        const verifytoken = jwt.verify(token, Skey)
        
        const rootUser = await User.findOne({_id:verifytoken._id})

        console.log(rootUser.first_name)

        const addAddress = await Address.create({
            user_id : rootUser._id,
            phone : req.body.phone,
            street : req.body.street,
            city : req.body.city,
            state : req.body.state,
            pincode : req.body.pincode,
        })
        console.log(addAddress)
        console.log("Address Added Successfully")
        res.status(201).json(addAddress)
    } 
    catch (err) {
        console.log(err)
        res.status(422).json("Error Found")
    }
});

app.delete("/api/deleteaddress/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const deleteAddress = await Address.findByIdAndDelete({ _id: id })
        // console.log(deletcategory);
        res.status(201).json(deleteAddress);

    } catch (error) {
        res.status(422).json(error);
    }
});

app.patch("/api/updateaddress/:id", async (req, res) => {
    try {

        const { id } = req.params

        console.log(id)
    
        const updateAddress = await Address.findByIdAndUpdate(id, {phone : req.body.phone, street : req.body.street, city : req.body.city, state : req.body.state, pincode : req.body.pincode}, {
            new: true
        })
        // console.log("243 =>"+updateBrand);
        res.status(201).json(updateAddress)
    } catch (error) {
        res.status(401).json(error)
    }
})

app.get("/api/logout", (req, res) => {
    req.session.destroy();
    return res.json({status : 'ok'})
});

app.post('/api/addcategory',async(req,res)=>{
    try{
        const addcategory=await Category.create({
            category_name:req.body.categoryName,
        })
        console.log("Category Added Successfully")
        res.status(201).json(addcategory)

    }
    catch(err)
    {
        res.status(422).json("Error")
        console.log(err)
    }
})
app.get('/api/getcategory',async(req,res)=>{
    try{
        const categoryList=await Category.find();
        res.status(201).json(categoryList)
    }
    catch(err)
    {
        res.status(422).json("Error")
        console.log(err)
    }
})
app.delete('/api/detelecategory/:id',async(req,res)=>{
    try{
        await Category.deleteOne({_id:req.params.id})
        res.status(200).json("success")
    }
    catch(err)
    {
        res.status(422).json("Error")
    }
})

app.get('/api/getcategoryid/:id',async(req,res)=>{
    try{
        const {id}=req.params;
        const categoryIdByData=await Category.findById({_id:id});
        res.status(200).json(categoryIdByData);
    }
    catch(err)
    {
        res.status(422).json("Error")
    }
})

app.get("/api/getproductid/:id", async (req, res) => {
    try {
        const {id} = req.params; 
        const productDataId = await Product.findById({_id: id});
        res.status(201).json(productDataId)
        // console.log(userdata);
    } catch (error) {
        res.status(422).json(error);
    }
});

app.get("/api/user", async (req, res) => {
    
    try{
        const token =  req.headers.authorization;
        console.log(token)
        const verifytoken = jwt.verify(token, Skey)
        //console.log(verifytoken);
        const rootUser = await User.findOne({_id:verifytoken._id})
        console.log(rootUser);
        if(!rootUser){
            throw new Error("user not found")
        }
        return res.status(201).json(rootUser);
    } catch (err) {
        console.log(err)
        res.status(422).json("Error Found")
    }   
});

app.get("/api/getAddressCnt",async (req, res) => {
    try{
        const token =  req.headers.authorization;
        
        const verifytoken = jwt.verify(token, Skey)
        
        const rootUser = await User.findOne({_id:verifytoken._id})

        const getAddressesData= await addressdb.find({user_id:rootUser._id});

        console.log(getAddressesData.length);

        res.status(201).json(getAddressesData.length);
    }
    catch(error)
    {
        res.status(422).json(error); 
    }
});

app.get("/api/logout", (req, res) => {
    console.log("logging out")
    // req.session.destroy();
    return res.json({status : 'ok'})
});

app.listen(1337, ()=>{
	console.log("Server is Started...")
})

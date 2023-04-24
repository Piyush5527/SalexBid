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
const Bid=require('./models/biddetails.model');
const bidJoinedDB=require("./models/bidjoined.model");
const Feedback = require("./models/feedback.model")
const transactionDB=require("./models/transactions.model");
const {spawn}=require('child_process');

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

app.get("/api/getadminmyorderid/:id", async (req, res) => {
    try {
        const {id} = req.params

        const myOrder = await FinalOrder.findById(id).populate('product_id user_id');

        const myOrderDetails = await Order.findById(myOrder.order_id).populate('address_id')
        console.log(myOrder);
        console.log(myOrderDetails);
        res.status(200).json({Order : myOrder, OrderDetails : myOrderDetails});
    } catch (err) {
        console.log(err)
        res.status(401).json(err)
    }
})

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

app.post("/api/adminLogin",async(req,res)=>{
    try{
        let email=req.body.email;
        let password=req.body.password;
        if(email === "admin@gmail.com" && password === "Admin@123"){
            console.log("all ok")
            res.json({ status : 'ok'});
        }
        else
        {
            console.log("error");
            return res.status("error");
        }
    }
    catch(err)
    {
        console.log(err)
        return res.status("error");
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

app.get("/api/getusercnt",async(req,res)=>{
    try{
        const userData=await User.find();
        // console.log(userData.length);
        res.status(201).json(userData.length);
    }
    catch(error)
    {
        res.status(422).json(error);
    }
});
app.get("/api/getproductcnt",async(req,res)=>{
    try{
        const productData=await Product.find();
        // console.log("product len",productData.length);
        res.status(201).json(productData.length);
    }
    catch(error)
    {
        res.status(422).json(error);
    }
});

app.get("/api/getordercount",async(req,res)=>{
    try{
        const orderData=await Order.find();
        // console.log(orderData.length);
        res.status(201).json(orderData.length);
    }
    catch(error)
    {
        res.status(422).json(error);
    }
});
app.get("/api/getcompletedordercount",async(req,res)=>{
    try{
        const completedorderData=await FinalOrder.find();
        res.status(201).json(completedorderData.length);
    }
    catch(error)
    {
        res.status(422).json(error);
    }
});

app.get("/api/getfeedbackcount",async(req,res)=>{
    try{
        const feedbackData=await Feedback.find();
        res.status(201).json(feedbackData.length);
    }
    catch(error)
    {
        res.status(422).json(error);
    }
});

app.get("/api/getallfeedbacks",async(req,res)=>{
    try{
        const feedbackData=await Feedback.find().populate('product_id user_id');
        res.status(201).json(feedbackData);
    }
    catch(error)
    {
        res.status(422).json(error);
    }
});

app.get("/api/getadminfeedbackid/:id",async(req,res)=>{
    try{
        const {id} = req.params; 
        const feedbackData=await Feedback.findById(id).populate('product_id user_id');
        res.status(201).json(feedbackData);
    }
    catch(error)
    {
        res.status(422).json(error);
    }
});

app.get("/api/getfeedbackproductid/:id",async(req,res)=>{
    try{
        const {id} = req.params; 
        const feedbackData=await Feedback.find({product_id:id}).populate('product_id user_id');
        res.status(201).json(feedbackData);
    }
    catch(error)
    {
        res.status(422).json(error);
    }
});

app.get("/api/getcategorycount",async(req,res)=>{
    try{
        const categoryCnt=await Category.find();
        res.status(201).json(categoryCnt.length);
    }
    catch(error)
    {
        res.status(422).json(error);
    }
});

app.get("/api/getlowstockcount",async(req,res)=>{
    try{
        const productCnt=await Product.find();

        let totalCnt = 0;

        productCnt.map((item)=>{
            if(item.prod_stock<10){
                totalCnt+=1;
            }
        });

        res.status(201).json(totalCnt);
    }
    catch(error)
    {
        res.status(422).json(error);
    }
});

app.get("/api/getotalsales",async(req,res)=>{
    try{
        const orderData=await FinalOrder.find();
        // console.log(typeof orderData);
        let total=0;
        orderData.map((item)=>{
            total+=item.total;
            
        });
        // console.log("total sales is :",total);
        res.status(201).json(total);
    }
    catch(error)
    {
        console.log(error)
        res.status(422).json(error);
    }
});

app.get("/api/getunitselled",async(req,res)=>{
    try{
        const orderData=await FinalOrder.find();
        // console.log(typeof orderData);
        let totalQty = 0;

        orderData.map((item)=>{
            totalQty+=item.quantity;
        });
        // console.log("total sales is :",total);
        res.status(201).json(totalQty);
    }
    catch(error)
    {
        console.log(error)
        res.status(422).json(error);
    }
})

app.get("/api/getthismonthsales",async(req,res)=>{
    try{
        const orderData=await FinalOrder.find();
        let thisMonthSales=0;
        let todayDate=new Date(Date.now());
        let month=todayDate.getMonth()+1;
        let year=todayDate.getFullYear()
        let formattedDate=year+"-"+month;
        // console.log("today date is :",formattedDate);
        orderData.map((item)=>{
            let saleMonth=item.created_at.getMonth()+1;
            let saleYear=item.created_at.getFullYear();
            let newFormatedDate=saleYear+"-"+saleMonth;
            if(newFormatedDate===formattedDate){
                thisMonthSales+=item.total;
            }
        })
        // console.log("this month sales is :",thisMonthSales);
        res.status(201).json(thisMonthSales);
    }
    catch(error)
    {
        console.log(error)
        res.status(422).json(error);
    }
})

app.post('/api/addfeedback/:id', async(req,res)=>{
   
    const {id} = req.params; 
    const token =  req.headers.authorization;
    console.log(token)
    console.log("Feedback ", req.body.feedback);
    const verifytoken = jwt.verify(token, Skey)
    const rootUser = await User.findOne({_id:verifytoken._id})

    try{
        const addFeedback=await Feedback.create({
           product_id : id,
           user_id : rootUser._id,
           feedback : req.body.feedback
        })
        console.log(addFeedback)
        console.log("Feedback Added Successfully")
        res.status(201).json(addFeedback)
    }
    catch(err)
    {
        console.log(err)
        res.status(422).json("Error")
    }
})

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
});

app.get('/api/getproduct',async(req,res)=>{
    try{
        const productdata=await Product.find().populate('category_id');
        res.status(201).json(productdata);
    }
    catch(err)
    {
        console.log(err)
        res.status(422).json(err)
    }
});

app.get("/api/getproductid/:id", async (req, res) => {
    try {
        const {id} = req.params; 
        const productDataId = await Product.findById({_id: id});
        res.status(201).json(productDataId)
        // console.log(userdata);
    } catch (error) {
        res.status(422).json(error);
    }
})

app.delete("/api/deleteproduct/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const deleteProduct = await Product.findByIdAndDelete({ _id: id })
        // console.log(deletcategory);
        res.status(201).json(deleteProduct);

    } catch (error) {
        res.status(422).json(error);
    }
});

app.patch("/api/updateproduct/:id", upload.single("image_path"), async (req, res) => {
    try {
        const { id } = req.params
        const {filename} = req.file
        console.log(filename)
        console.log(req.body)
        const updateProduct = await Product.findByIdAndUpdate(id, {product_name : req.body.pname,
            category_id : req.body.category_id,
            prod_price : req.body.price,
            small_desc : req.body.small_desc,
            long_desc : req.body.long_desc,
            prod_image : filename,
            prod_stock : req.body.qty,
            prod_size : req.body.size}, {
            new: true
        })
        // console.log("243 =>"+updateBrand);
        res.status(201).json(updateProduct)
    } catch (error) {
        res.status(422).json(error)
    }
});

app.get("/api/getcategory", async (req, res) => {
    try {
        const categorydata = await Category.find();
        res.status(201).json(categorydata)
        // console.log(userdata);
    } catch (error) {
        res.status(422).json(error);
    }
});

app.patch("/api/updatecategory/:id", async (req, res) => {
    try {

        const { id } = req.params

        const updateCategory = await Category.findByIdAndUpdate(id, {category_name : req.body.category_name}, {
            new: true
        })
        // console.log("243 =>"+updateBrand);
        res.status(201).json(updateCategory)
    } catch (error) {
        res.status(422).json(error)
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

// app.get("/api/logout", (req, res) => {
//     req.session.destroy();
//     return res.json({status : 'ok'})
// });

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

app.post("/api/createbid",upload.single('productImage'),async(req, res) => {
    try{
        const {filename}=req.file;
        console.log(filename);
        const token = req.headers.authorization;
        const verifytoken = jwt.verify(token,Skey);
        const rootUser = await User.findOne({_id:verifytoken._id});
        if(rootUser)
        {
            const addBid=await Bid.create({
                product_name:req.body.productName,
                product_category:req.body.category,
                base_price:req.body.basePrice,
                short_desc:req.body.shortDesc,
                long_desc: req.body.longDesc,
                start_date:req.body.startDate,
                image_name:filename,
                u_id:rootUser._id
            })

            console.log(addBid);
            console.log("Product added successfully");
            res.status(201).json(addBid);
        }
        else
        {
            res.status(420).json({status:'usernotfound'});
        }
        
    }
    catch(error)
    {
        res.status(422).json(error);
    }
});

app.get("/api/getbiddata",async(req,res)=>{
    try{
        const getBidData=await Bid.find().populate('u_id');
        res.status(200).json(getBidData);
    }
    catch(error)
    {
        console.log(error);
        res.status(422).json(error);
    }
})
app.get("/api/getbidbyid/:id",async(req,res)=>{
    try{
        const {id} = req.params; 
        console.log(id)
        const singleBidData=await Bid.findOne({_id: id});
        if(singleBidData)
        {
            console.log(singleBidData)
            res.status(200).json(singleBidData)
        }
        else
        {
            request.status(422).json("cant find data")
            console.log("cant find the data for bid required");
        }
    }  
    catch(error) 
    {
        res.status(422).json(error);
    }
})
app.post('/api/approvebid',async(req,res)=>{
    const id=req.body.id;
    console.log(id)
    const approveStatus=req.body.approved;
    const approveBid=await Bid.updateOne({_id:id},{allowed:approveStatus})
    console.log("updated successfully")
    res.status(200).json("Success")
})

app.get('/api/getmybiddata',async(req,res)=>{
    try{
        const token=req.headers.authorization;
        // console.log(token);
        const verifytoken = jwt.verify(token,Skey);
        if(verifytoken)
        {
            const myBidData=await Bid.find({u_id:verifytoken._id})
            console.log(myBidData)
            res.status(200).json(myBidData)
        }
        else
        {
            res.status(422).json("User Not Logged In");
        }
    }
    catch(error)
    {
        console.log(error)
        res.status(422).json(error)
    }
})

app.get("/api/logout", (req, res) => {
    console.log("logging out")
    // req.session.destroy();
    return res.json({status : 'ok'})
});

app.get("/api/checkpaymentneed/:id",async(req,res)=>{
    try
    {
        const {id}=req.params;
        const token=req.headers.authorization;
        const verifytoken = jwt.verify(token,Skey);
        // const verifytoken=jwt.verify(token,Skey);
        console.log("in payment need",verifytoken._id,id);
        const PaymentChecker=await bidJoinedDB.find({product_id:id,user_id:verifytoken._id});
        console.log("Payment detail",PaymentChecker)
        if(PaymentChecker.length === 1) 
        {
            console.log("Payment Not needed")
            res.status(200).json(false)
        }
        else
        {
            console.log("Payment Needed",PaymentChecker.user_id)
            res.status(200).json(true)
        }

    }
    catch(error)
    {
        res.status(422).json("Error")
        console.log(error)
    }
});

app.post('/api/joinbidpayment/:id',async(req,res)=>{
    try
    {
        const {id}=req.params;
        const token=req.headers.authorization;
        const verifyToken=jwt.verify(token,Skey);
        if(verifyToken)
        {

        }
    }
    catch(error)
    {
        console.log(error)
    }
})
app.get('/api/getorderforbid',async(req,res)=>{
    const options = {
        amount : 5000,
        currency : "INR",
    };

    const order = await razorpayInstance.orders.create(options)
    console.log("In order generation ",order)
    res.status(200).json(order)
})
app.post('/api/paymentverificationforbids',async(req,res)=>{
    console.log("In Payment Verification for bids")
    console.log("Payment Id : ",req.body)
    const token =  req.headers.authorization;
    console.log("Token from payment verification ")
    const verifytoken = jwt.verify(token, Skey)
    
    console.log(verifytoken._id)
    console.log(verifytoken);
    const rootUser = await User.findOne({_id:verifytoken._id})
    let body=req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id;
    var expectedSignature = crypto.createHmac('sha256', 'S0A6zi0OqqbyF4MF5PYI04Cz')
                                    .update(body.toString())
                                    .digest('hex');
    console.log("sig received " ,req.body.razorpay_signature);
    console.log("sig generated " ,expectedSignature);
    if(expectedSignature === req.body.razorpay_signature){
    console.log("Signature Matched")
    
    const transactionData=await transactionDB.create({
        user_id : rootUser._id,
        t_id : req.body.razorpay_payment_id,
        amount : req.body.razorpay_amount,
        reason : req.body.reason,
        product_id :req.body.bid_id,
    })
    // transactionData.save()
    if(transactionData) {
        const bidJoinedConfirmation=bidJoinedDB.create({
            product_id : req.body.bid_id,
            user_id : rootUser._id,
            amount : 0,
            lastbid : Date.now(),
            accept_status : true,
        })
        // bidJoinedConfirmation.save()
    }
    res.status(200).json({reference : req.body.razorpay_payment_id})
} else {
    res.status(401).json("Error")
    }

})

app.get('/api/getcurrentbiddings/:id',async(req,res)=>{
    const{id}=req.params;
    console.log("From Current Biddings",id)
    const result=await bidJoinedDB.find({product_id:id}).populate("user_id")
    // console.log("Length",result.length)
    if(result.length !== undefined)
    {
        res.status(200).json(result)
    }
    else
    {
        res.status(422).json("error")
    }
})
app.get('/api/getmybids',async(req,res)=>{
    const token=req.headers.authorization;
    const verifyUser=jwt.verify(token,Skey)
    if(verifyUser)
    {
        // console.log(verifyUser._id)
        const bidData=await bidJoinedDB.find({user_id:verifyUser._id}).populate("product_id")
        // console.log("sdvs",bidData)
        if(bidData.length !==undefined)
        {
            res.status(200).json(bidData)
        }
    }
    else
    {
        res.status(422).json("please login")
    }
})

app.get('/api/getjoinedbids/:id',async(req,res)=>{
    const{id}=req.params;
    console.log("From Current Biddings",id)
    const result=await bidJoinedDB.find({_id:id}).populate("user_id")
    // console.log("Length",result.length)
    if(result.length !== undefined)
    {
        res.status(200).json(result)
    }
    else
    {
        res.status(422).json("error")
    }
})

// const ls=spawn('python',['scripts/dobChecker.py','idProof/itachimangekyou.png'])
// ls.stdout.on('data',(data)=>{
//     console.log(`stdoutput ${data}`);
//     // if(data==30)
//     // {
//     //     console.log('True')
//     // }
//     // else
//     // {    
//     //     console.log('False')
//     // }
// });

// ls.stderr.on('data',(data)=>{
//     console.log(`stderror`,data);
    
// });
// ls.on('close',(code)=>{
//     console.log(`child process exited with code ${code}`);
// });
app.listen(1337, ()=>{
	console.log("Server is Started...")
})

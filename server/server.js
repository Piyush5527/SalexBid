const express = require("express")
const jwt = require("jsonwebtoken")
const cors = require("cors")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const crypto = require("crypto")
const multer = require('multer')
const bcrypt=require("bcrypt")
const fs = require('fs')

const { application } = require("express")

const Skey = "jujutsukaisengojoyujiandmanymore"


const User = require('./models/user.model')

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/salexbid');

app.post('/api/register', async (req, res) => {
    console.log(req.body);
    let encPass=""
    try {
    await bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(req.body.password,salt,function(err,hash){
            encPass=hash
            console.log(encPass)

            User.create({
                full_name : req.body.fullName,
                phone : req.body.phone,
                email : req.body.email,
                password : encPass,
                address : req.body.address, 
                gender : req.body.gender,
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
    
    const user1 = await User.findOne({
        email : req.body.email, 
        // password : req.body.password, 
    })
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
    
})

//EndLogin

app.listen(1337, ()=>{
	console.log("Server is Started...")
})

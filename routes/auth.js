const express = require("express")
const bcrypt = require("bcrypt")
const authRouter = express.Router();
const validateSignup = require("../utils/validate");
const User = require("../Schema/User");
const jwt = require("jsonwebtoken")
authRouter.post("/signup",async (req,res)=>{
    try{
        validateSignup(req);
        const {name,email,password} = req.body;
        const hashPassword = await bcrypt.hash(password,10);

        const user = new User({
            name,email,
            password:hashPassword
        })
        const savedUser = await user.save();
        const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET_KEY,{expiresIn:"1d"})

        res.cookie("token",token,{
            httpOnly:true,
            secure:true,
            expires: new Date(Date.now() + 3*60*60*1000)
        })

        res.status(200).json({
            message:"User added successfully",
            user:savedUser
        })


    }catch(err){
        res.status(400).send("ERROR: " + err.message);
    }
})

module.exports = authRouter
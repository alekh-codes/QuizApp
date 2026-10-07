const express = require("express")
const bcrypt = require("bcrypt")
const authRouter = express.Router();
const validateSignup = require("../utils/validate");
const User = require("../Schema/User");
const jwt = require("jsonwebtoken");

authRouter.post("/signup",async (req,res)=>{
    try{
        validateSignup(req);
        const {name,email,password} = req.body;
        const hashPassword = await bcrypt.hash(password,10);

        const user = new User({
            name,
            email,
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

authRouter.post("/login", async (req,res)=>{
    try{
        const {email,password} = req.body;
        const user = await User.findOne({email});

        if(!user) throw new Error("User doesn't exist");

        const isPassValid = await bcrypt.compare(password,user.password);

        if(isPassValid){
            const token = await jwt.sign({_id:user._id}, process.env.JWT_SECRET_KEY,{expiresIn:"1d"})

            res.cookie("token",token,{
                httponly:true,
                secure:true,
                expires: new Date(Date.now() + 3 * 60 * 60 * 1000),
            })
        }
        res.status(200).json({user,
            message:"Login successful"
        })
    }
    catch(err){
        res.status(400).send("Invlaid credentials")
    }
})

module.exports = authRouter
const User = require("../Schema/User");
const jwt = require("jsonwebtoken");
const userAuth = async (res,req,next) => {
    try{
        const {token} = req.cookies;
        if(!token){
            return res.status(401).json({message:"Please login"})
        }

        const findUser = await jwt.verify(token,process.env.JWT_SECRET_KEY);

        const {_id} = findUser;

        const user = await User.findById(_id);

        if(!user) return res.status(401).json({message:"Invlaid user"});

        req.user = user;
        next();
    }catch(err){
        res.status(400).json("Error: " + err.message);
    }
} 

module.exports = userAuth;
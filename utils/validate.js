const validator = require("validator")

const validateSignUp = (req) =>{
    const {name,email,password} = req.body;

    if(name.length < 3){
        throw new Error("Name is too short")
    }
    if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)){
        throw new Error("Email is not valid")
    }
    if(!validator.isStrongPassword(password)){
        throw new Error("Enter a strong password");
    }

}

module.exports = validateSignUp
const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
        minLength:4
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
    },
    quizedAttempted:{
        type:Number,
        default:0

    }
},{
    timestamps:true
})


module.exports = mongoose.model("User",userSchema)

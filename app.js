require("dotenv").config()
const express = require("express");
const app = express();
const connectDB = require("./Database/database")
const cors = require("cors")
app.use(cors())
app.use(express.json());

app.use("/",(req,res)=>{
    res.send("Hello world")
})

connectDB()
.then(()=>{
    app.listen(3000,()=>{
    console.log("App listening on port 3000");
    })
})
.catch(()=>{
    console.log("Error in connecting with db");
    
})


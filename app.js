require("dotenv").config()
const express = require("express");
const app = express();
const connectDB = require("./Database/database")
const cors = require("cors")
const cookieParser = require("cookie-parser")
app.use(cors())
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const quizRouter = require("./routes/quizRouter")
app.use("/",authRouter)
app.use("/",quizRouter)



connectDB()
.then(()=>{
    app.listen(3000,()=>{
    console.log("App listening on port 3000");
    })
})
.catch(()=>{
    console.log("Error in connecting with db");    
})


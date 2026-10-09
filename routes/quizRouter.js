const { default: axios } = require("axios");
const express = require("express")
const quizRouter = express.Router();

quizRouter.get("/categories", async(req,res) =>{
    const category = ["JavaScript","Java","C++","C","Python","React","Node.js","SQL","PostgreSQL"]
    res.status(200).json({
    topics:category});
})

quizRouter.get("/topics", async(req,res)=>{
    try{
        const {topic} = req.query;

        if(!topic) throw new Error("please provide a topic");
        const quizQuestion = await axios.get("https://quizapi.io/api/v1/questions",{
            headers:{
                Authorization: `Bearer ${process.env.QUIZ_API_KEY}`
            },
                params: {
                    tags: topic.toLowerCase(),
                    limit:10,
                }
  
        });

        return res.status(200).json(quizQuestion.data);
    }
    catch(err){
        console.log(err.quizQuestion?.data || err.message)
        res.status(400).json("Try again after sometime")
    }

})



module.exports = quizRouter;


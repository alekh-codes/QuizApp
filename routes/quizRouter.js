const { default: axios } = require("axios");
const express = require("express");
const userAuth = require("../middlewares/auth");
const QuizAttempt = require("../Schema/QuizAttempt");
const quizRouter = express.Router();

quizRouter.get("/categories",userAuth ,async(req,res) =>{
    const category = ["JavaScript","Java","C++","C","Python","React","Node.js","SQL","PostgreSQL"]
    res.status(200).json({
    topics:category});
})

quizRouter.get("/topics",userAuth, async(req,res)=>{
    try{
        const {topic,difficulty,limit=20,offset=0} = req.query;

        if(!topic || typeof topic !== "string" || !topic.trim()){
            return res.status(400).json({
                success:false,
                message:"Please provide a valid topic"
            })
        }

        const allowedDifficulties = ["EASY","MEDIUM","HARD","EXPERT"]

        if(difficulty && !allowedDifficulties.includes(difficulty.toUpperCase())){
            return res.status(400).json({
                success:false,
                message:"Invalid difficulty"
            })
        }

        const questionLimit = Number(limit)
        const questionOffset = Number(offset)

        if(!Number.isInteger(questionLimit) || questionLimit < 1 || questionLimit > 20 || !Number.isInteger(questionOffset) || questionOffset < 0){
            return res.status(400).json({
                success:false,
                message:"Onvalid pagination parameters"
            })
        }

        const quizQuestion = await axios.get("https://quizapi.io/api/v1/questions",{
            headers:{
                Authorization: `Bearer ${process.env.QUIZ_API_KEY}`
            },
                params: {
                    tags: topic.trim().toLowerCase(),
                    difficulty:difficulty?.toUpperCase(),
                    limit:questionLimit,
                    offset:questionOffset
                } ,
                timeout:10000
        });

        const {data,meta} = quizQuestion.data;

        if(!data || data.length === 0){
            return res.status(404).json({
                success:false,
                message:"No question found for the topic"
            })
        }

        const questions = data.map(question=> ({
            questionId:question.id,
            text:question.text,
            type:question.type,
            difficulty:question.difficulty,
            categpry:question.category,
            tags:question.tags,

            options: question.answers.map(answer =>({
                answerId: answer.id,
                text:answer.text
            }))
        }))

        return res.status(200).json({
            success:true,
            message:"uestions fetched successfully",
            data:{
                questions,
                pagination:{
                    total:meta.total,
                    currentPage:meta.page,
                    lastPage:meta.lastPage,
                    limit:meta.limit,
                    offset:meta.offset
                }
            }
        })
    }
    catch (err) {
        console.log(
            "Topics API Error:",
            err.response?.data || err.message
        );

        if (err.response) {
            return res.status(502).json({
                success: false,
                message: "Question provider returned an error"
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
})

module.exports = quizRouter;


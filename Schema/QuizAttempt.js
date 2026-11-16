const mongoose = require("mongoose");

const QuizAttemptSchema = mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    topic:{
        type:String,
        required:true
    },
    difficulty:{
        type:String,
        enum:["EASY","MEDIUM","HARD","EXPERT"],
        required:true
    },
    questions:[
        {
            questionId:{
                type:String,
                required:true
            },
            quizId:{
                type:String,
                required:true
            },
            questionText: {
                type: String,
                required: true
            },

            options: [
                {
                    answerId: String,
                    text: String
                }
            ],

            correctAnswerIds: {
                type: [String],
                required: true
            }
        }
    ],
     answers: [
        {
            questionId: {
                type: String,
                required: true
            },

            selectedAnswerIds: {
                type: [String],
                default: []
            }
        }
    ],

    status:{
        type:String,
        enum:["in-progress","completed"],
        default:"in-progress"
    },
    score:{
        type:Number,
        default:null
    },
    startedAt:{
        type:Date,
        default:Date.now
    },
    completedAt:{
        type:Date,
        default:null
    }
}
,{
    timestamps:true
})

module.exports = mongoose.model("QuizAttempt",QuizAttemptSchema)
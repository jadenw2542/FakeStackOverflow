// Question Document Schema
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
    title: {
        type : String,
        required: true,
        maxLength: 100
    },
    text: {
        type : String,
        required: true
    },
    summary: {
        type : String,
        required: true,
        maxLength: 140
    },
    tags :  [{type: Schema.Types.ObjectId, ref: "Tag", required: true }],
    answers: [{type: Schema.Types.ObjectId, ref: "Answer" }],
    comments: [{type: Schema.Types.ObjectId, ref: "Comment" }],
    asked_by: {
        type: String,
        default: 'Anonymous'
    },

    ask_date_time :
    {
        type: Date,
        default: Date.now
    },
    views: {
        type: Number,
        default: 0
    },
    votes: {
        type: Number,
        default: 0
    },

    author_id: {type: Schema.Types.ObjectId, ref: "User" , required: true},
    url: String
    });

const Question = mongoose.model("Question", QuestionSchema);
module.exports = Question;

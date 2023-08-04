// Answer Document Schema
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AnswerSchema = new Schema({
    text: {
        type: String ,
        required: true
    },
    ans_by: {
        type: String,
        required: true,
    }, 
    ans_date_time: {
        type: Date,
        default: Date.now()
    },
    votes: {
        type: Number,
        default: 0
    },
    comments: [{type: Schema.Types.ObjectId, ref: "Comment" }],
    author_id: {type: Schema.Types.ObjectId, ref: "User" , required: true},
    url: String
    });

const Answer = mongoose.model("Answer", AnswerSchema);
module.exports = Answer;
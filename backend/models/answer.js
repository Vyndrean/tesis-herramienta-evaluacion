const mongoose = require('mongoose')
const Schema = mongoose.Schema
const AnswerSchema = new Schema({
    answerUser: {
        type: String
    },
    question: {
        type: Schema.ObjectId,
        ref: 'question'
    },
    answerUserData: {
        type: Array
    }
})

module.exports = mongoose.model('answer', AnswerSchema)
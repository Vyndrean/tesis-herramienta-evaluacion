const mongoose = require('mongoose')
const Schema = mongoose.Schema
const AnswerSchema = new Schema({
    answerUser: {
        type: String,
        required: true
    },
    answerQuestion: {
        type: Schema.ObjectId,
        ref: 'question',
        required: true

    },
    answerUserData: {
        type: Array
    }
})

module.exports = mongoose.model('answer', AnswerSchema)
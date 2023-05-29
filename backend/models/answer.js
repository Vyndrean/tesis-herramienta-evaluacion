const mongoose = require('mongoose')
const Schema = mongoose.Schema
const AnswerSchema = new Schema({
    answerUser: {
        type: String,
        required: true
    },
    answerUserData: {
        type: Array
    }
})

module.exports = mongoose.model('answer', AnswerSchema)
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const AnswerSchema = new Schema({
    response: {
        type: String,
        required: true
    },
    who_answer: {
        type: Schema.ObjectId,
        ref: 'userRespond',
        required: true
    }
})

module.exports = mongoose.model('answer', AnswerSchema)
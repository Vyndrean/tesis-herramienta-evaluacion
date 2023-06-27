const mongoose = require('mongoose')
const Schema = mongoose.Schema
const AnswerSchema = new Schema({
    answerUser: {
        type: Array,
        required: true
    },
    question: {
        type: Schema.ObjectId,
        ref: 'question',
        required: true
    },
    participant: {
        type: Schema.ObjectId,
        ref: 'participant',
        required: true
    },
    product: {
        type: Schema.ObjectId,
        ref: 'product',
        required: true
    }
})

module.exports = mongoose.model('answer', AnswerSchema)
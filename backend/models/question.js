const mongoose = require('mongoose')
const Schema = mongoose.Schema
const QuestionSchema = new Schema({
    questionName: {
        type: String,
        required: true
    },
    questionType: {
        type: String,
        required: true
    },
    questionOptions: { 
        type: Array
    },
    questionContext: {
        type: String
    },
    evaluation: {
        type: Schema.ObjectId,
        ref: 'evaluation',
        required: true
    },
    questionPosition: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('question', QuestionSchema)
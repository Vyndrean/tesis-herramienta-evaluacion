const mongoose = require('mongoose')
const Schema = mongoose.Schema
const QuestionSchema = new Schema({
    questionName: {
        type: String
    },
    questionType: {
        type: String
    },
    questionOptions: { type: Array },
    questionContext: {
        type: String
    },
    evaluation: {
        type: Schema.ObjectId,
        ref: 'evaluation',
        required: true
    }
})

module.exports = mongoose.model('question', QuestionSchema)
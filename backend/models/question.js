const mongoose = require('mongoose')
const Schema = mongoose.Schema
const QuestionSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    eva:{
        type: Schema.ObjectId,
        ref: 'evaluation',
        required: true
    }
})

module.exports = mongoose.model('question', QuestionSchema)
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const EvaluationSchema = new Schema({
    created_at: {
        type: Date,
        default: Date.now
    },
    title: {
        type: String,
        required: true
    },
    introduction: {
        type: String
    },
    status: {
        type: String,
        enum: ['pending', 'send', 'finished'],
        required: true
    },
    isEditable: {
        type: Boolean
    }
}
)
module.exports = mongoose.model('evaluation', EvaluationSchema)
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
    isEditable: {
        type: Boolean
    }
}
)
module.exports = mongoose.model('evaluation', EvaluationSchema)
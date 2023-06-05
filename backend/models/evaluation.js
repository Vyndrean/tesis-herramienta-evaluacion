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
    start_date: {
        type: Date,
        required: true
    },
    end_date: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'send', 'finished']
    }
}
)
module.exports = mongoose.model('evaluation', EvaluationSchema)
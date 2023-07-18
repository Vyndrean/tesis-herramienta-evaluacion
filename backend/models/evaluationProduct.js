const mongoose = require('mongoose')
const Schema = mongoose.Schema
const EvaluationProduct = new Schema({
    created_at: {
        type: Date,
        default: Date.now
    },
    start_date: {
        type: Date,
        required: true
    },
    end_date: {
        type: Date,
        required: true
    },
    emails: {
        type: Array,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'active', 'finished'],
        required: true
    },
    evaluation: {
        type: Schema.ObjectId,
        ref: 'evaluation',
        required: true
    },
    product: {
        type: Schema.ObjectId,
        ref: 'product',
        required: true
    }
})

module.exports = mongoose.model('evaluationProduct', EvaluationProduct)
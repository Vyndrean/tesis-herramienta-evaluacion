const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ProductSchema = new Schema({
    created_at:{
        type: Date,
        default: Date.now
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('product', ProductSchema)
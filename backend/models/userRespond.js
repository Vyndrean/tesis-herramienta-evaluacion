const mongoose = require('mongoose')
const Schema = mongoose.Schema
const UserRespondsSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    birthday:{
        type: Date,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ['F', 'M'],
        required: true
    }
})

module.exports = mongoose.model('userResponds', UserRespondsSchema)
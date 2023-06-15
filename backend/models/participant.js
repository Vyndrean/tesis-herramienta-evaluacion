const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ParticipantSchema = new Schema({
    name: {
        type: String
    },
    birthday: {
        type: Date
    },
    email: {
        type: String
    },
    gender: {
        type: String,
        enum: ['M', 'F']
    },
    educ_level: {
        type: String
    }
})

module.exports = mongoose.model('participant', ParticipantSchema)
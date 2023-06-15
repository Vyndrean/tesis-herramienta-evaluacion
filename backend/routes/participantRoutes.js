const express = require('express')
const api = express.Router()
const participantController = require('../controllers/participantController')

api.post('/participant', participantController.createParticipant)
api.get('/participant/search/:id', participantController.getParticipant)
api.get('/participants', participantController.getParticipants)
api.delete('/participant/delete/:id', participantController.deleteParticipant)

module.exports = api
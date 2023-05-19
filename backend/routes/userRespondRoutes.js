const express = require('express')
const api = express.Router()
const userRespondController = require('../controllers/userRespondController')

api.post('/respond', userRespondController.createRespond)
api.get('/responds', userRespondController.getRespond)
api.delete('/respond/delete/:id', userRespondController.deleteRespond)

module.exports = api
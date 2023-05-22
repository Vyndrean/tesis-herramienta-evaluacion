const express = require('express')
const api = express.Router()
const answerController = require('../controllers/answerController')

api.post('/answer', answerController.createAnswer)
api.get('/answers', answerController.getAnswer)
api.delete('/answer/delete/:id', answerController.deleteAnswer)

module.exports = api
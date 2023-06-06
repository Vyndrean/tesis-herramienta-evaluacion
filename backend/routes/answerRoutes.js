const express = require('express')
const api = express.Router()
const answerController = require('../controllers/answerController')

api.post('/answer', answerController.createAnswer)
api.get('/answers', answerController.getAnswers)
api.delete('/answer/delete/:id', answerController.deleteAnswer)
api.get('/answer/search/:id', answerController.getAnswer)

module.exports = api

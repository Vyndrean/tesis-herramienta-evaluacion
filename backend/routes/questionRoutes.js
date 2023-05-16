const express = require('express')
const api = express.Router()
const questionController = require('../controllers/questionController')

api.post('/question', questionController.createQuestion)
api.get('/questions', questionController.getQuestion)
api.delete('/question/delete/:id', questionController.deleteQuestion)

module.exports = api
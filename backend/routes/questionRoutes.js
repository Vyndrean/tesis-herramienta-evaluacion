const express = require('express')
const api = express.Router()
const questionController = require('../controllers/questionController')

api.post('/question', questionController.createQuestion)
api.get('/questions', questionController.getQuestions)
api.delete('/question/delete/:id', questionController.deleteQuestion)
api.get('/question/:id', questionController.getQuestion)
api.put('/question/update/:id', questionController.updateQuestion)

module.exports = api
const express = require('express')
const api = express.Router()
const evaluationController = require('../controllers/evaluationController')

api.post('/evaluation', evaluationController.createEvaluation)
api.get('/evaluations', evaluationController.getEvaluations)
api.delete('/evaluation/delete/:id', evaluationController.deleteEvaluation)
api.put('/evaluation/update/:id', evaluationController.updateEvaluation)
api.get('/evaluation/search/:id', evaluationController.getEvaluation)

module.exports = api
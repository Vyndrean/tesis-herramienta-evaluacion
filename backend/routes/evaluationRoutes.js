const express = require('express')
const api = express.Router()
const evaluationController = require('../controllers/evaluationController')

api.post('/evaluation', evaluationController.createEvaluation)
api.get('/evaluations', evaluationController.getEvaluation)
api.delete('/evaluation/delete/:id', evaluationController.deleteEvaluation)
api.put('/evaluation/update/:id', evaluationController.updateEvaluation)

module.exports = api
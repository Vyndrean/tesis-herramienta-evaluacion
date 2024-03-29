const express = require('express')
const api = express.Router()
const evaluationProduct = require('../controllers/evaluationProductController')

api.post('/evaPro', evaluationProduct.createEvaluationProduct)
api.get('/evaPros', evaluationProduct.getEvaluationProducts)
api.get('/evaPro/search/:id', evaluationProduct.getEvaluationProduct)
api.delete('/evaPro/delete/:id', evaluationProduct.deleteEvaluationProduct)
api.post('/validate/evaPro', evaluationProduct.validateEvaluationProduct)
api.post('/evaPro/evaluation', evaluationProduct.getEvaProByID)

module.exports = api
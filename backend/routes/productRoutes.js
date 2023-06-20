const express = require('express')
const api = express.Router()
const productController = require('../controllers/productController')

api.post('/product', productController.createProduct)
api.get('/products', productController.getProducts)
api.get('/product/search/:id', productController.getProduct)
api.delete('/product/delete/:id', productController.deleteProduct)
api.put('/product/update/:id', productController.updateProduct)

module.exports = api
const express = require('express')
const api = express.Router()
const userController = require('../controllers/userController')

api.post('/register', userController.createUser)
api.post('/login', userController.loginUser)
api.get('/users', userController.getUser)
api.delete('/user/delete/:id', userController.deleteUser)

module.exports = api

const express = require('express')
const api = express.Router()
const userController = require('../controllers/userController')
const auth = require('../middleware/auth')

api.post('/register', userController.createUser)
api.post('/login', userController.login)
api.get('/users', userController.getUser)
api.delete('/user/delete/:id', userController.deleteUser)
api.get('/checkToken', auth, userController.checkToken)
api.post('/logout', userController.logout)
api.put('/user/update/:id', userController.updateUser)

module.exports = api

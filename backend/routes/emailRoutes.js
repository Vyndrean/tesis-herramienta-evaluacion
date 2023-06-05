const express = require('express')
const api = express.Router()
const emailController = require('../controllers/emailController')

api.post('/send', emailController.sendEmail)

module.exports = api

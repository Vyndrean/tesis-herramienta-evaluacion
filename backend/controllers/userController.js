const User = require('../models/user')
const bcrypt = require('bcrypt')
const { createToken } = require('../services/token')

const createUser = (req, res) => {
    const { username } = req.body
    const password = bcrypt.hashSync(req.body.password, 5)
    User.findOne({ username }, (err, user) => {
        if (err) {
            return res.status(400).send({ message: "Error al registrar al usuario" })
        }
        if (user) {
            return res.status(401).send({ message: "Ya existe un usuario registado con ese nombre" })
        }
        const newUser = new User({
            username,
            password
        })
        newUser.save((err, user) => {
            if (err) {
                return res.status(400).send({ message: "Error al registrar al usuario" })
            }
            return res.status(201).send(user)
        })
    })
}

const checkToken = (req, res) => {
    return res.status(200).send({ message: 'Token valido' })
}

const login = (req, res) => {
    let username = req.body.username
    User.findOne({ username }, (err, user) => {
        if (err) {
            return res.status(400).send({ message: 'Error al iniciar sesion' })
        }
        if (!user) {
            return res.status(404).send({ message: 'No se encontro el usuario' })
        }
        bcrypt.compare(req.body.password, user.password, (err, check) => {
            if (err) {
                return res.status(400).send({ message: 'Error al iniciar sesion' })
            }
            if (!check) {
                return res.status(400).send({ message: 'La contraseña es incorrecta' })
            }
            res.cookie('token', createToken(user), { httpOnly: true })
            return res.status(200).send({ message: 'Inicio sesion correctamente', token: createToken(user), user: user.username })
        })
    })
}

const logout = (req, res) => {
    res.clearCookie('token')
    return res.status(200).send({ message: "Sesion cerrada" })
}

const getUser = (req, res) => {
    User.find({}, (err, users) => {
        if (err) {
            return res.status(400).send({ message: "Error al mostrar los registros de los usuarios" })
        }
        return res.status(200).send(users)
    })
}

const deleteUser = (req, res) => {
    const { id } = req.params
    User.findByIdAndDelete(id, (err, user) => {
        if (err) {
            return res.status(400).send({ message: "Error al borrar el registro del usuario" })
        }
        return res.status(200).send(user)
    })
}

module.exports = {
    createUser,
    login,
    getUser,
    deleteUser,
    checkToken,
    logout
}
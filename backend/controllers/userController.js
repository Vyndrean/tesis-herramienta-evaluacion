const User = require('../models/user')

const createUser = (req, res) => {
    const { username, password } = req.body
    User.findOne({username, password}, (err, user) => {
        if(err){
            return res.status(400).send({message: "Error al registrar al usuario"})
        }
        if(user){
            return res.status(401).send({message: "Ya existe un usuario registado con ese nombre"})
        }
        const newUser = new User({
            username,
            password
        })
        newUser.save((err, user) => {
            if(err){
                return res.status(400).send({message: "Error al registrar al usuario"})
            }
            return res.status(201).send(user)
        })
    })
}

const loginUser = (req, res) => {
    let { username, password } = req.body
    User.findOne({username, password}, (err, user) => {
        if(err){
            return res.status(400).send({message: "Error al iniciar sesion"})
        }
        if(!user){
            return res.status(404).send({message: "El usuario ingresado no existe"})
        }
        return res.status(200).send({message: "Se inicio sesion correctamente"})
    })
}

const getUser = (req, res) => {
    User.find({}, (err, users) => {
        if(err){
            return res.status(400).send({message: "Error al mostrar los registros de los usuarios"})
        }
        return res.status(200).send(users)
    })
}

const deleteUser = (req, res) => {
    const { id } = req.params
    User.findByIdAndDelete(id, (err, user) => {
        if(err){
            return res.status(400).send({message: "Error al borrar el registro del usuario"})
        }
        return res.status(200).send(user)
    })
}

module.exports = {
    createUser,
    loginUser,
    getUser,
    deleteUser
}
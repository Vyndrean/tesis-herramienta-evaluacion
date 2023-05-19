const UserRespond = require('../models/answer')

const createRespond = (req, res) => {
    const {name, birthday, email, gender} = req.body
    const newRespond = new UserRespond (
        {
            name,
            birthday,
            email,
            gender
        }
    )
    newRespond.save((err, respond) => {
        if(err){
            return res.status(400).send({message: "Error al registrar al usuario"})
        }
        return res.status(200).send(respond)
    })
}

const getRespond = (req, res) => {
    UserRespond.find({}, (err, respond) => {
        if(err){
            return res.status(400).send({message: "Error al mostrar los usuarios que responden"})
        }
        return res.status(200).send(respond)
    })
}

const deleteRespond = (req, res) => {
    const { id } = req.params
    UserRespond.findByIdAndDelete( id , (err, respond) => {
        if(err){
            return res.status(400).send({message: "Error al eliminar al usuario que responde"})
        }
        if(!id){
            return res.status(410).send({messge: "No se encuentra al usuario"})
        }
        return res.status(200).send(respond)
    })
}


module.exports = {
    createRespond,
    getRespond,
    deleteRespond
}
const Participant = require('../models/participant')

const createParticipant = (req, res) => {
    const { name, birthday, email, gender, educ_level } = req.body
    const newParticipant = new Participant(
        {
            name, birthday, email, gender, educ_level
        }
    )
    newParticipant.save((err, participant) => {
        if (err) {
            return res.status(400).send({ message: "Error al crear al usuario participante" })
        }
        return res.status(200).send(participant)
    })
}

const getParticipants = (_req, res) => {
    Participant.find({})
        .exec((err, participant) => {
            if (err) {
                return res.status(400).send({ message: "Error al mostrar a los usuarios participantes" })
            }
            if (!participant) {
                return res.status(404).send({ message: "No hay participantes registrados" })
            }
            return res.status(200).send(participant)
        })
}

const getParticipant = (req, res) => {
    const { id } = req.params
    Participant.findById(id)
        .exec((err, participant) => {
            if (err) {
                return res.status(400).send({ message: "Error la mostrar el usuario participante" })
            }
            if (!participant) {
                return res.status(404).send({ message: "Usuario participante no existente" })
            }
            return res.status(200).send(participant)
        })
}

const deleteParticipant = (req, res) => {
    const { id } = req.params
    Participant.findByIdAndDelete(id, (err, participant) => {
        if (err) {
            return res.status(400).send({ message: "Error al borrar al usuario participante" })
        }
        if (!participant) {
            return res.status(404).send({ message: "Error al borrar, no existe el usuario participante" })
        }
        return res.status(200).send(participant)
    })
}

const updateParticipant = (req, res) => {
    const { id } = req.params
    Participant.findByIdAndUpdate(id, req.body, (err, participant) => {
        if (err) {
            return res.status(404).send({ message: "Error al actualizar al usuario participante" })
        }
        if (!participant) {
            return res.status(404).send({ message: "Error la actualizar, no existe el usuario participante" })
        }
        return res.status(200).send(participant)
    })
}

module.exports = {
    createParticipant,
    getParticipants,
    getParticipant,
    deleteParticipant,
    updateParticipant
}
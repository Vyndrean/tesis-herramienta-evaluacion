const Answer = require('../models/answer')

const createAnswer = (req, res) => {
    const { answerUser, answerUserData, question } = req.body
    const newAnswer = new Answer(
        {
            answerUser,
            answerUserData,
            question
        }
    )
    newAnswer.save((err, answer) => {
        if (err) {
            return res.status(400).send({ message: "Error crear la respuesta" })
        }
        return res.status(200).send(answer)
    })
}

const getAnswers = (req, res) => {
    Answer.find({})
        .populate('question')
        .exec((err, answer) => {
            if (err) {
                return res.status(400).send({ message: "Error al mostrar las respuestas" })
            }
            return res.status(200).send(answer)
        })
}

const getAnswer = (req, res) => {
    const { id } = req.params
    Answer.find({
        question: {
            _id: id
        }
    })
        .populate('question')
        .exec((err, answer) => {
            if (err) {
                return res.status(400).send({ message: "Error al mostrar las respuestas" })
            }
            if (!id) {
                return res.status(404).send({ message: "No se encuentra la pregunta asociada a la respuesta" })
            }
            return res.status(200).send(answer)
        })
}


const deleteAnswer = (req, res) => {
    const { id } = req.params
    Answer.findByIdAndDelete(id, (err, answer) => {
        if (err) {
            return res.status(400).send({ message: "Error al borrar la respuesta" })
        }
        if (!id) {
            return res.status(410).send({ message: "Error, no se encuentra la respuesta" })
        }
        return res.status(200).send(answer)
    })
}

module.exports = {
    createAnswer,
    getAnswers,
    deleteAnswer,
    getAnswer
}
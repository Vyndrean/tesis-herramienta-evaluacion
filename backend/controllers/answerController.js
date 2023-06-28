const Answer = require('../models/answer')
const Question = require('../models/question')
const Evaluation = require('../models/evaluation')

const createAnswer = (req, res) => {
    const { answerUser, question, participant, product } = req.body
    const newAnswer = new Answer(
        {
            answerUser,
            question,
            participant,
            product
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
        .populate('question participant product')
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
        'question': id
    })
        .populate('question participant product')
        .exec((err, answer) => {
            if (err) {
                return res.status(400).send({ message: "Error al mostrar las respuestas" })
            }
            if (!answer) {
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

const updateAnswer = (req, res) => {
    const { id } = req.params
    Answer.findByIdAndUpdate(id, req.body, (err, answer) => {
        if (err) {
            return res.status(400).send({ message: "Error al actualizar las respuestas" })
        }
        if (!answer) {
            return res.status(404).send({ message: "Error no se encuentra la respuesta" })
        }
        return res.status(200).send(answer)
    })
}

const getAnswersByProduct = (req, res) => {
    const { idEvaluation, idProduct } = req.body
    Question.find({
        'evaluation': idEvaluation
    })
        .populate('question')
        .exec((err, questions) => {
            if (err) {
                return res.status(400).send({ message: "Error al mostrar las preguntas de la evaluacion" })
            }

            const questionIds = questions.map(question => question._id)

            Answer.find({
                'question': { $in: questionIds },
                'product': idProduct
            })
                .populate('participant product question')
                .exec((err, answers) => {
                    if (err) {
                        return res.status(400).send({ message: "Error al mostrar las respuestas de la evaluacion" })
                    }

                    return res.status(200).send(answers)
                })
        })
}



module.exports = {
    createAnswer,
    getAnswers,
    deleteAnswer,
    getAnswer,
    updateAnswer,
    getAnswersByProduct
}
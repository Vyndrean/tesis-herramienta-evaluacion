const Question = require('../models/question')

const createQuestion = (req, res) => {
    const { name, eva } = req.body
    const newQuestion = new Question(
        {
            name,
            eva
        }
    )
    newQuestion.save((err, question) => {
        if (err) {
            return res.status(400).send({ message: "Error al crear el registro" })
        }
        return res.status(202).send(question)
    })
}

const getQuestions = (req, res) => {
    Question.find({})
        .populate('evaluation')
        .exec((err, question) => {
            if (err) {
                return res.status(400).send({ messge: "Error al mostrar los registros de preguntas" })
            }
            return res.status(200).send(question)
        })
}

const getQuestion = (req, res) => {
    const { id } = req.body
    Question.find({ id }, (err, question) => {
        if (err) {
            return res.status(400).send({ message: "Error al buscar el registro" })
        }
        return res.status(200).send(question)
    })
}

const deleteQuestion = (req, res) => {
    const { id } = req.params
    Question.findByIdAndDelete(id, (err, question) => {
        if (err) {
            return res.status(400).send({ message: "Error al eliminar el registro" })
        }
        return res.status(200).send({ "status": "La pregunta ha sido eliminada correctamente", question })
    })
}

module.exports = {
    createQuestion,
    getQuestions,
    deleteQuestion,
    getQuestion
}
const Question = require('../models/question')

const createQuestion = (req, res) => {
    const { questionName, evaluation, questionType, questionOptions, questionContext } = req.body
    const newQuestion = new Question(
        {
            questionName,
            evaluation,
            questionType,
            questionOptions,
            questionContext
        }
    )
    newQuestion.save((err, question) => {
        if (err) {
            return res.status(400).send({ message: "Error al crear el registro" })
        }
        return res.status(200).send(question)
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
    const { id } = req.params
    Question.find({
        evaluation: {
            _id: id
        }
    })
        .populate('evaluation')
        .exec((err, question) => {
            if (err) {
                return res.status(400).send({ message: "Error al mostrar las preguntas de la evaluacion" })
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

const updateQuestion = (req, res) => {
    const { id } = req.params
    Question.findByIdAndUpdate(id, req.body, (err, question) => {
        if (err) {
            return res.status(400).send({ message: "Error al actualizar la pregunta" })
        }
        if (!question) {
            return res.status(404).send({ message: "Error al actualizar, no existe la pregunta" })
        }
        return res.status(200).send(question)
    })
}

module.exports = {
    createQuestion,
    getQuestions,
    deleteQuestion,
    getQuestion,
    updateQuestion
}
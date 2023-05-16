const Question = require('../models/question')

const createQuestion = (req, res) => {
    const {name, eva} = req.body
    const newQuestion = new Question(
        {
            name,
            eva
        }
    )
    newQuestion.save((err, question) => {
        if(err){
            return res.status(400).send({message: "Error al crear el registro"})
        }
        return res.status(200).send(question)
    })
}

const getQuestion = (req, res) => {
    Question.find({}, (err, question) => {
        if(err){
            return res.status(400).send({message: "Error al encontrar el registro"})
        }
        return res.status(200).send(question)
    })
}

const deleteQuestion = (req, res) => {
    const { id } = req.params
    Question.findByIdAndDelete(id, (err, question) => {
        if(err){
            return res.status(400).send({message: "Error al eliminar el registro"})
        }
        return res.status(200).send({"status":"La pregunta ha sido eliminada correctamente",question})
    })
}

module.exports = {
    createQuestion,
    getQuestion,
    deleteQuestion
}
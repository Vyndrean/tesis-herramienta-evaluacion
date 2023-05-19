const Answer = require('../models/answer')

const createAnswer = (req, res) => {
    const { response, who_answer } = req.body
    const newAnswer = new Answer (
        {
            response,
            who_answer
        }
    )
    newAnswer.save((err, answer) => {
        if(err){
            return res.status(400).send({message: "Error crear la respuesta"})
        }
        return res.status(200).send(answer)
    })
}

const getAnswer = (req, res) => {
    Answer.find({}, (err, answer) => {
        if(err){
            return res.status(400).send({message: "Error al mostrar las respuestas"})
        }
        return res.status(200).send(answer)
    })
}

const deleteAnswer = (req, res) => {
    const { id } = req.params
    Answer.findByIdAndDelete(id, (err, answer) => {
        if(err){
            return res.status(400).send({message: "Error al borrar la respuesta"})
        }
        if(!id){
            return res.status(410).send({message: "Error, no se encuentra la respuesta"})
        }
        return res.status(200).send(answer)
    })
}

module.exports = {
    createAnswer,
    getAnswer,
    deleteAnswer
}
const Evaluation = require('../models/evaluation')

const createEvaluation = (req, res) => {
    const { title, introduction } = req.body
    const newEvaluation = new Evaluation(
        {
            title,
            introduction
        }
    )
    newEvaluation.save((err, evaluation) => {
        if (err) {
            return res.status(400).send({ message: "Error al crear la evaluacion" })
        }
        return res.status(200).send(evaluation)
    })
}

const getEvaluations = (_req, res) => {
    Evaluation.find({}, (err, evaluation) => {
        if (err) {
            return res.status(400).send({ message: "Error al mostar las evaluaciones" })
        }
        if (!evaluation) {
            return res.status(404).send({ message: "Error no existen evaluaciones" })
        }
        return res.status(200).send(evaluation)
    })
}

const deleteEvaluation = (req, res) => {
    const { id } = req.params;
    Evaluation.findByIdAndDelete(id, (err, evaluation) => {
        if (err) {
            return res.status(400).send({ message: "Error al eliminar la evaluacion" })
        }
        if (!evaluation) {
            return res.status(404).send({ message: "Error al eliminar la evaluacion" })
        }
        return res.status(200).send(evaluation)
    })
}

const updateEvaluation = (req, res) => {
    const { id } = req.params
    Evaluation.findByIdAndUpdate(id, req.body, (err, evaluation) => {
        if (err) {
            return res.status(400).send({ message: "Error al actualizar los datos de la evaluacion" })
        }
        if (!evaluation) {
            return res.status(404).send({ message: "Error al actualizar, no existe evaluacion" })
        }
        return res.status(200).send(evaluation)
    })
}

const getEvaluation = (req, res) => {
    const { id } = req.params
    Evaluation.findById(id, (err, evaluation) => {
        if (err) {
            return res.status(400).send({ message: "Error al buscar la evaluacion" })
        }
        if (!evaluation) {
            return res.status(404).send({ message: "No existe la evaluacion" })
        }
        return res.status(200).send(evaluation)
    })
}

module.exports = {
    createEvaluation,
    getEvaluation,
    deleteEvaluation,
    updateEvaluation,
    getEvaluations
}
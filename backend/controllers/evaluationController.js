const Evaluation = require('../models/evaluation')

const createEvaluation = (req, res) => {
    const {title, introduction, start_date, end_date, status} = req.body
    const newEvaluation = new Evaluation(
        {
            title,
            introduction,
            start_date,
            end_date,
            status
        }
    );
    newEvaluation.save((err, evaluation) => {
        if(err){
            return res.status(400).send({message: "Error al ingresar la evaluacion"})
        }
        return res.status(200).send(evaluation)
    })
}

const getEvaluation = (_req, res) => {
    Evaluation.find({}, (err, evaluation) => {
        if(err){
            return res.status(400).send({message: "Error al mostar el registro"})
        }
        return res.status(200).send(evaluation)
    })
}

const deleteEvaluation = (req, res) => {
    const { id } = req.params;
    Evaluation.findByIdAndDelete(id, (err, evaluation) => {
        if(err){
            return res.status(400).send({message: "Error al eliminar el registro"})
        }
        return res.status(200).send({"status":"Se ha eliminado correctamente la evaluacion",evaluation})
    })
}

module.exports = {
    createEvaluation,
    getEvaluation,
    deleteEvaluation
}
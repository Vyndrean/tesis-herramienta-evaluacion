const EvaluationProduct = require('../models/evaluationProduct')

const createEvaluationProduct = (req, res) => {
    const { start_date, end_date,  emails, evaluation, product } = req.body
    const newEvaluationProduct = new EvaluationProduct(
        {
            start_date,
            end_date,
            emails,
            evaluation,
            product
        }
    )
    newEvaluationProduct.save((err, evaluationProduct) => {
        if (err) {
            return res.status(400).send({ message: "Error al registrar la evaluacion para el producto a evaluar" })
        }
        return res.status(200).send(evaluationProduct)
    })
}

const getEvaluationProducts = (req, res) => {
    EvaluationProduct.find({})
        .populate('evaluation product')
        .exec((err, evaPro) => {
            if (err) {
                return res.status(400).send({ message: "Error al mostar los productos evaluados" })
            }
            return res.status(200).send(evaPro)
        })
}

const getEvaluationProduct = (req, res) => {
    const { id } = req.params
    EvaluationProduct.findById(id)
        .populate('evaluation product')
        .exec((err, evaPro) => {
            if (err) {
                return res.status(400).send({ message: "Error al mostrar el producto evaluado" })
            }
            if (!evaPro) {
                return res.status(404).send({ message: "No se encuentra registros de evaluacion para el producto" })
            }
            return res.status(200).send(evaPro)
        })
}

const deleteEvaluationProduct = (req, res) => {
    const { id } = req.params
    EvaluationProduct.findByIdAndDelete(id, (err, evaPro) => {
        if (err) {
            return res.status(400).send({ message: "Error al borrar la evaluacion del producto" })
        }
        if (!evaPro) {
            return res.status(404).send({ message: "Erro al borra la evaluacion del producto, no se encuentran el registro " })
        }
        return res.status(200).send(evaPro)
    })
}

const validateEvaluationProduct = (req, res) => {
    const { evaluation, product } = req.body
    EvaluationProduct.findOne({
        evaluation,
        product
    })
        .exec((err, evaPro) => {
            if (err) {
                return res.status(400).send({ message: "Error al validar" })
            }
            if(!evaPro){
                return res.status(404).send({message: "Error al validar"})
            }
            return res.status(200).send(evaPro)
        })
}

module.exports = {
    createEvaluationProduct,
    getEvaluationProduct,
    getEvaluationProducts,
    deleteEvaluationProduct,
    validateEvaluationProduct
}
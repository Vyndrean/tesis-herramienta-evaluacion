import axios from 'axios'

const createEvaluation = (evaluation) => {
    const res = axios.post(`${process.env.SERVIDOR}/evaluation`, evaluation)
    return res
}

const getEvaluations = async () => {
    const res = await axios.get(`${process.env.SERVIDOR}/evaluations`)
    return res
}

const getEvaluation = async (id) => {
    const res = await axios.get(`${process.env.SERVIDOR}/evaluation/search/${id}`)
    return res
}

const updateEvaluation = async (idEvaluation, status) => {
    const res = await axios.put(`${process.env.SERVIDOR}/evaluation/update/${idEvaluation}`, status)
    return res
}

const deleteByRef = (id, refe) => {
    const res = axios.delete(`${process.env.SERVIDOR}/${refe}/delete/${id}`)
    return res
}

module.exports = {
    createEvaluation,
    getEvaluations,
    updateEvaluation,
    getEvaluation,
    deleteByRef
}
import axios from 'axios'

const createEvaluation = (evaluation) => {
    const res = axios.post(`${process.env.SERVIDOR}/evaluation`, evaluation)
    return res
}

const getEvaluations = async () => {
    const res = await axios.get(`${process.env.SERVIDOR}/evaluations`)
    return res
}

const getQuestions = async (id) => {
    const res = await axios.get(`${process.env.SERVIDOR}/question/${id}`)
    return res
}

const getEvaluation = async (id) => {
    const res = await axios.get(`${process.env.SERVIDOR}/evaluation/search/${id}`)
    return res
}

const deleteEvaluation = (id) => {
    const res = axios.delete(`${process.env.SERVIDOR}/evaluation/delete/${id}`)
    return res
}

const createQuestion = (question) => {
    const res = axios.post(`${process.env.SERVIDOR}/question`, question)
    return res
}

const deleteQuestion = (idQuestion) => {
    const res = axios.delete(`${process.env.SERVIDOR}/question/delete/${idQuestion}`)
    return res
}

const updateEvaluation = (idEvaluation, email) => {
    const res = axios.put(`${process.env.SERVIDOR}/evaluation/update/${idEvaluation}`, email)
    return res
}

module.exports = {
    createEvaluation,
    getEvaluations,
    getQuestions,
    deleteEvaluation,
    createQuestion,
    deleteQuestion,
    updateEvaluation,
    getEvaluation
}
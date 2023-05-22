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
    const res = await axios.get(`${process.env.SERVIDOR}/question/${id.id}`)
    console.log(res)
    return res
}

module.exports = {
    createEvaluation,
    getEvaluations,
    getQuestions
}
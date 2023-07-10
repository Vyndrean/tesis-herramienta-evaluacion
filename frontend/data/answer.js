import axios from "axios";

const createAnswer = (answer) => {
    const res = axios.post(`${process.env.SERVIDOR}/answer`, answer)
    return res
}

const getQuestionAnswer = (id) => {
    const res = axios.get(`${process.env.SERVIDOR}/answer/search/${id}`)
    return res
}

const getAnswersByProduct = (data) => {
    const res = axios.post(`${process.env.SERVIDOR}/answers/product`, data)
    return res
}

const getAnswersByQuestion = (data) => {
    const res = axios.post(`${process.env.SERVIDOR}/question/answers`, data)
    return res
}

const getAnswerOfParticipant = (data) => {
    const res = axios.post(`${process.env.SERVIDOR}/participant/answer`, data)
    return res
}

const updateAnswers = (id, data) => {
    const res = axios.put(`${process.env.SERVIDOR}/answer/update/${id}`, data)
    return res
} 

module.exports = {
    createAnswer,
    getQuestionAnswer,
    getAnswersByProduct,
    getAnswersByQuestion,
    getAnswerOfParticipant,
    updateAnswers
}
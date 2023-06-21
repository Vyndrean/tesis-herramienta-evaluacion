import axios from "axios";

const createAnswer = (answer) => {
    const res = axios.post(`${process.env.SERVIDOR}/answer`, answer)
    return res
}

const getQuestionAnswer = (id) => {
    const res = axios.get(`${process.env.SERVIDOR}/answer/search/${id}`)
    return res
}

module.exports = {
    createAnswer,
    getQuestionAnswer
}
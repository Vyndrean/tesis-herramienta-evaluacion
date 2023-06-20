import axios from "axios";

const getQuestions = async (id) => {
    const res = await axios.get(`${process.env.SERVIDOR}/question/${id}`)
    return res
}
const createQuestion = (question) => {
    const res = axios.post(`${process.env.SERVIDOR}/question`, question)
    return res
}

const updateQuestion = (id, question) => {
    const res = axios.put(`${process.env.SERVIDOR}/question/delete/${id}`, question)
    return res
}


module.exports = {
    createQuestion,
    getQuestions,
    updateQuestion
}
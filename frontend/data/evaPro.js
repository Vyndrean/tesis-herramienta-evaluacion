import axios from "axios";

const createEvaPro = (data) => {
    const res = axios.post(`${process.env.SERVIDOR}/evaPro`, data)
    return res
}

const validateEvaPro = (data) => {
    const res = axios.post(`${process.env.SERVIDOR}/validate/evaPro`, data)
    return res
}

const getEvaProByID = async (id) => {
    const res = await axios.post(`${process.env.SERVIDOR}/evaPro/evaluation`, id)
    return res
}

const getEvaluationProduct = (id) => {
    const res = axios.get(`${process.env.SERVIDOR}/evaPro/search/${id}`)
    return res
}

module.exports = {
    createEvaPro,
    validateEvaPro,
    getEvaProByID,
    getEvaluationProduct
}
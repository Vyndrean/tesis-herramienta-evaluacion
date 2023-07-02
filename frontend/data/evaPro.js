import axios from "axios";

const createEvaPro = (data) => {
    const res = axios.post(`${process.env.SERVIDOR}/evaPro`, data)
    return res
}

const validateEvaPro = (data) => {
    const res = axios.post(`${process.env.SERVIDOR}/validate/evaPro`, data)
    return res
}

module.exports = {
    createEvaPro,
    validateEvaPro
}
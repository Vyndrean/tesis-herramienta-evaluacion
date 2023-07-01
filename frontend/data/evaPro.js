import axios from "axios";

const createEvaPro = (data) => {
    const res = axios.post(`${process.env.SERVIDOR}/evaPro`, data)
    return res
}

module.exports = {
    createEvaPro
}
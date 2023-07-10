import axios from "axios";

const createParticipant = (data) => {
    const res = axios.post(`${process.env.SERVIDOR}/participant`, data)
    return res
}  

const getParticipant = (id) => {
    const res = axios.get(`${process.env.SERVIDOR}/participant/search/${id}`)
    return res
}

module.exports = {
    createParticipant,
    getParticipant
}
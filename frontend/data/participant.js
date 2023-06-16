import axios from "axios";

const createParticipant = (data) => {
    const res = axios.post(`${process.env.SERVIDOR}/participant`, data)
    return res
}  

module.exports = {
    createParticipant
}
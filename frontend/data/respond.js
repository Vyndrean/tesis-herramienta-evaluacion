import axios from "axios";

const createAnswer = (answer) => {
    const res = axios.post(`${process.env.SERVIDOR}/answer`, answer)
    return res
}

module.exports = {
    createAnswer
}
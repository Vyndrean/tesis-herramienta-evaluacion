import axios from "axios";

const sendEmail = (email) => {
    const response = axios.post(`${process.env.SERVIDOR}/send`, email)
    return response
}

module.exports = {
    sendEmail
}
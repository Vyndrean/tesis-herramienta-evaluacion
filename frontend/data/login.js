import axios from "axios";

const login = async (sesion) => {
    const response = await axios.post(`${process.env.SERVIDOR}/login`, sesion)
    return response
}

const logout = async () => {
    const response = await axios.get(`${process.env.SERVIDOR}/logout`)
    return response
}

const checkToken = async (token) => {
    const response = await axios.get(`${process.env.SERVIDOR}/checkToken`, { headers: { cookie: token } })
    return response
}

module.exports = {
    login,
    logout,
    checkToken
}
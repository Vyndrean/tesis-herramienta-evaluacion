import axios from "axios";

const login = async (sesion) => {
    const response = await axios.post(`${process.env.SERVIDOR}/login`, sesion)
    return response
}

const logout = async () => {
    const response = await axios.post(`${process.env.SERVIDOR}/logout`)
    return response
}

const checkToken = async (token) => {
    const response = await axios.get(`${process.env.SERVIDOR}/checkToken`, { headers: { cookie: token } })
    return response
}

const getUsers = async () => {
    const response = await axios.get(`${process.env.SERVIDOR}/assistants`)
    return response
}

const updateUser = (id, user) => {
    const response = axios.put(`${process.env.SERVIDOR}/user/update/${id}`, user)
    return response
}

const createUser = (user) => {
    const response = axios.post(`${process.env.SERVIDOR}/register`, user)
    return response
}
 
module.exports = {
    login,
    logout,
    checkToken,
    getUsers,
    createUser,
    updateUser
}
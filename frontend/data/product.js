import axios from "axios";

const createProduct = (product) => {
    const res = axios.post(`${process.env.SERVIDOR}/product`, product)
    return res
}

const getProducts = async () => {
    const res = await axios.get(`${process.env.SERVIDOR}/products`)
    return res
}

const getProduct = async (id) => {
    const res = await axios.get(`${process.env.SERVIDOR}/product/search/${id}`)
    return res
}

const deleteProduct = (id) => {
    const res = axios.delete(`${process.env.SERVIDOR}/product/delete/${id}`)
    return res
}

const updateProduct = async (id, product) => {
    const res = axios.put(`${process.env.SERVIDOR}/product/update/${id}`, product)
    return res
}

module.exports = {
    createProduct,
    getProducts,
    getProduct,
    deleteProduct,
    updateProduct
}
const Product = require('../models/product')

const createProduct = (req, res) => {
    const { name, description, type, link } = req.body
    const newProduct = new Product(
        {
            name,
            description,
            type,
            link
        }
    )
    newProduct.save((err, product) => {
        if (err) {
            return res.status(400).send({ message: "Error al crear el producto" })
        }
        return res.status(200).send(product)
    })
}

const getProducts = (req, res) => {
    Product.find({}, (err, product) => {
        if (err) {
            return res.status(400).send({ message: "Error al mostrar los productos o servicios registrados" })
        }
        if (!product) {
            return res.status(404).send({ message: "Error no existen productos o servicios existentes" })
        }
        return res.status(200).send(product)
    })
}

const getProduct = (req, res) => {
    const { id } = req.params
    Product.findById(id, (err, product) => {
        if (err) {
            return res.status(400).send({ message: "Error la mostrar el producto" })
        }
        if (!product) {
            return res.status(404).send({ message: "El producto no se encuentra registrado" })
        }
        return res.status(200).send(product)
    })
}

const deleteProduct = (req, res) => {
    const { id } = req.params
    Product.findByIdAndDelete(id, (err, product) => {
        if (err) {
            return res.status(400).send({ message: "Error al eliminar el producto o servicio" })
        }
        if (!product) {
            return res.status(404).send({ message: "Error al eliminar el producto, no se encuentra registrado" })
        }
        return res.status(200).send(product)
    })
}

const updateProduct = (req, res) => {
    const { id } = req.params
    Product.findByIdAndUpdate(id, req.body, (err, product) => {
        if (err) {
            return res.status(400).send({ message: "Error al actualizar los datos del producto o servicio" })
        }
        if (!product) {
            return res.status(404).send({ message: "Error al actualiar los datos del producto, no se encuentra registrado" })
        }
        return res.status(200).send(product)
    })
}

module.exports = {
    createProduct,
    getProducts,
    getProduct,
    deleteProduct,
    updateProduct
}
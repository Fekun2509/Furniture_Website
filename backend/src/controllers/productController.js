import userServices from "../services/userServices"
import productServices from "../services/productServices"


let handleGetAllCategories = async (req, res) => {
    let id = req.query.id; //ALL, id

    if (!id) {
        return res.status(200).json({
            errCode: 0,
            errMessage: 'Missing required parameter',
            categories: []
        })
    }

    let categories = await productServices.getAllCategories(id);


    return res.status(200).json({
        errCode: 0,
        errMessage: 'Ok',
        categories
    })
}

let handleCreateNewProduct = async (req, res) => {
    let message = await productServices.creatNewProduct(req.body)
    return res.status(200).json(message)
}

let handleGetAllProducts = async (req, res) => {
    let id = req.query.id; //ALL, id

    if (!id) {
        return res.status(200).json({
            errCode: 0,
            errMessage: 'Missing required parameter',
            products: []
        })
    }

    let products = await productServices.getAllProducts(id);


    return res.status(200).json({
        errCode: 0,
        errMessage: 'Ok',
        products
    })
}

let handleEditProduct = async (req, res) => {
    let message = await productServices.editProduct(req.body);
    return res.status(200).json(message);
}

let handleDeleteProduct = async (req, res) => {
    let message = await productServices.deleteProduct(req.query.id);
    return res.status(200).json(message);
}

module.exports = {
    handleGetAllCategories: handleGetAllCategories,
    handleCreateNewProduct: handleCreateNewProduct,
    handleGetAllProducts: handleGetAllProducts,
    handleEditProduct: handleEditProduct,
    handleDeleteProduct: handleDeleteProduct,
}

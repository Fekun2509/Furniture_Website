import express from "express";
import homeController from "../controllers/homeController";
import userController from "../controllers/userController";
import productController from "../controllers/productController"

import upload from "../middleware/upload";

let router = express.Router();

let initWebRoutes = (app) => {
    router.get('/', homeController.getHomePage);
    router.get('/about', homeController.getAboutPage);
    router.get('/crud', homeController.getCRUD);
    router.post('/post-crud', homeController.postCRUD);
    router.get('/get-crud', homeController.displayGetCRUD);
    router.get('/edit-crud', homeController.getEditCRUD);
    router.post('/put-crud', homeController.putCRUD);
    router.get('/delete-crud', homeController.deleteCRUD);


    router.post('/api/login', userController.handleLogin)
    router.post('/api/auth/google', userController.handleGoogleLogin)
    router.post('/api/auth/facebook', userController.handleFacebookLogin)
    router.get('/api/get-all-users', userController.handleGetAllUsers)
    router.post('/api/create-new-user', userController.handleCreateNewUser)
    router.put('/api/edit-user', userController.handleEditUser)
    router.delete('/api/delete-user', userController.handleDeleteUser)

    router.get('/api/get-categories', productController.handleGetAllCategories)

    //products
    router.post('/api/create-new-product', productController.handleCreateNewProduct)

    //upload image
    router.post('/api/upload-image', upload.array('images', 6), (req, res) => {
        try {
            const imageUrls = req.files.map((file) => file.path);
            return res.json({ errCode: 0, urls: imageUrls });
        } catch (e) {
            return res.status(500).json({ errCode: 1, message: e.message });
        }
    });

    router.get('/api/get-all-products', productController.handleGetAllProducts)
    router.put('/api/edit-product', productController.handleEditProduct)
    router.delete('/api/delete-product', productController.handleDeleteProduct)

    return app.use("/", router);
}

module.exports = initWebRoutes;
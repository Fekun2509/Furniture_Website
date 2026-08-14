import { raw } from "body-parser";
import db from "../models/index"


let getAllCategories = (categoryId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let categories = '';
            if (categoryId == 'ALL') {
                categories = await db.ProductC.findAll({})
            }

            if (categoryId && categoryId !== 'ALL') {
                categories = await db.ProductC.findOne({
                    where: { id: categoryId },
                })
            }
            resolve(categories)

        } catch (e) {
            reject(e)
        }
    })
}

let creatNewProduct = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log('Check dataInput: ', data)
            await db.ProductP.create({
                category_id: data.category_id,
                name: data.name,
                description: data.description,
                base_price: data.base_price,
                sell_price: data.sell_price,
                stock_qty: data.stock_qty,
                weight: data.weight ? parseFloat(data.weight) : null,
                material: data.material,
                style: data.style,
                color: data.color,
                image: data.image || '[]'
            })

            resolve({
                errCode: 0,
                message: 'Ok'
            })


        } catch (e) {
            reject(e)
        }
    })
}

let getAllProducts = (productId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let products = '';
            if (productId == 'ALL') {
                products = await db.ProductP.findAll({
                    // logging: console.log
                })
            }

            if (productId && productId !== 'ALL') {
                products = await db.ProductP.findOne({
                    where: { id: productId },
                })
            }
            resolve(products)

        } catch (e) {
            reject(e)
        }
    })
}

let editProduct = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                return resolve({ errCode: 1, message: 'Missing product id' });
            }
            await db.ProductP.update({
                category_id: data.category_id,
                name: data.name,
                description: data.description,
                base_price: data.base_price,
                sell_price: data.sell_price,
                stock_qty: data.stock_qty,
                weight: data.weight ? parseFloat(data.weight) : null,
                material: data.material,
                style: data.style,
                color: data.color,
                image: data.image,
            }, { where: { id: data.id } });
            resolve({ errCode: 0, message: 'Ok' });
        } catch (e) {
            reject(e);
        }
    });
}

let deleteProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                return resolve({ errCode: 1, message: 'Missing product id' });
            }
            await db.ProductP.destroy({ where: { id } });
            resolve({ errCode: 0, message: 'Ok' });
        } catch (e) {
            reject(e);
        }
    });
}

module.exports = {
    getAllCategories: getAllCategories,
    creatNewProduct: creatNewProduct,
    getAllProducts: getAllProducts,
    editProduct: editProduct,
    deleteProduct: deleteProduct,
}
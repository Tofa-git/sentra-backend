"use strict"

const chalk = require('chalk');
const { request } = require('express');
const db = require('../config/sequelize');
const productModel = db.products;
const AppError = require('../utils/appError')


const addProduct = async (req, res) => {
    // console.log(chalk.yellow.inverse('reqqqqqqqqqq'), req.body, req.file);
    if(!req.file) return res.status(500).send({ message: 'please uploade image.' });
    const imgFileName = req.file.filename;
    const { name, description, originalPrice, discount, category, status } = req.body;
    const product = {
        name, description, originalPrice, discount, category, imagePath: imgFileName, status
    }
    const addedProduct = await productModel.create(product);

    if (addedProduct) {
        res.status(201).send({ message: 'Product added successfully.', addedProduct: addedProduct });
    } else {
        res.status(404).send({ message: 'Could not add product.' });
    }
}

const getProducts = async (req, res, next) => {
    if(!req.query.size || !req.query.page) return res.status(500).send({message: 'page number and page size are required !'})
    let pageSize = +req.query.size;
    if(pageSize > 100) {
        pageSize = 100; 
    }
    let pageOffset = ((+req.query.page - 1) * +req.query.size);
    const products = await productModel.findAll({
        attributes: ['id', 'name', 'description', 'originalPrice', 'discount', 'category', 'imagePath', 'status'],
        offset: pageOffset,
        limit: pageSize,
    });
    const imageUrl = req.protocol + "://" + req.get("host") + '/images/';
    products.forEach(product => {
        product.imagePath = imageUrl + product.imagePath;
    })

    if (products.length > 0) {
        res.status(200).send({ message: 'Products found.', products: products });
    } else {
        res.status(404).send({ message: 'Product not found.' });
    }

}

const getProduct = async (req, res) => {
    const pdoductId = req.params.id;
    const product = await productModel.findOne({
        attributes: ['id', 'name', 'description', 'originalPrice', 'discount', 'category', 'imagePath', 'status'],
        where: {
            id: pdoductId
        }
    });
    const imageUrl = req.protocol + "://" + req.get("host") + '/images/';
    
    if (product) {
        product.imagePath = imageUrl + product.imagePath;
        res.status(200).send({ message: 'Product found.', product: product });
    } else {
        res.status(404).send({ message: 'Product not found.' });
    }

}

const editProduct = async (req, res) => {
    const pdoductId = req.params.id;
    const imgFileName = req.file.filename;
    const { name, description, originalPrice, discount, category, status } = req.body;

    const product = {
        name, description, originalPrice, discount, category, imagePath: imgFileName, status
    }

    const updatedProduct = await productModel.update(product, { where: { id: pdoductId } });

    if (updatedProduct[0] > 0) {
        res.status(200).send({ message: 'Product updated successfully.', updatedProduct: updatedProduct });
    } else {
        res.status(404).send({ message: 'Could not update product.' });
    }
}

const deleteProduct = async (req, res) => {
    const pdoductId = req.params.id;
    const deletedProduct = await productModel.destroy({ where: { id: pdoductId } });

    if (deletedProduct) {
        res.status(200).send({ message: 'Product deleted successfully.', deletedProduct: deletedProduct });
    } else {
        res.status(404).send({ message: 'Product not deleted.' });
    }
}


module.exports = {
    addProduct,
    getProducts,
    getProduct,
    editProduct,
    deleteProduct
}
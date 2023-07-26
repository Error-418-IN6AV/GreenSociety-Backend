'use strict'

const express = require('express')
const api = express.Router();
const productController = require('./product.controller')
const connectMultiparty = require('connect-multiparty')
const upload = connectMultiparty({uploadDir: './uploads/products'})

api.get('/test', productController.test);
api.post('/add', productController.add);
api.get('/getProducts', productController.getProducts)
api.get('/getProduct/:id', productController.getProduct)
api.post('/search', productController.search);
api.put('/update/:id', productController.updateProduct)
api.delete('/delete/:id', productController.deleteProduct)
api.put('/uploadImage/:id', upload, productController.addImage)
api.get('/getImage/:fileName', upload, productController.getImage)
module.exports = api;
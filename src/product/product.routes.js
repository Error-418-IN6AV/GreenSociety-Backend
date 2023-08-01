'use strict'

const express = require('express')
const api = express.Router();
const productController = require('./product.controller')
const connectMultiparty = require('connect-multiparty')
const upload = connectMultiparty({ uploadDir: './uploads/products' })
const { ensureAuth } = require('../services/authenticated');

api.get('/test', productController.test);
api.post('/add', [ensureAuth], productController.add);
api.get('/getProducts', productController.getProducts)
api.get('/getProduct/:id', productController.getProduct)
api.get('/getProducct/:id', productController.getProducct)
api.post('/search', [ensureAuth], productController.search);
api.put('/update/:id', [ensureAuth], productController.updateProduct)
api.delete('/delete/:id', [ensureAuth], productController.deleteProduct)
api.put('/uploadImage/:id', upload, productController.addImage)
api.get('/getImage/:fileName', upload, productController.getImage)
module.exports = api;
'use strict'

const express = require('express');
const api = express.Router();
const categoryController = require('./category.cotroller')

api.get('/test', categoryController.test);
api.post('/add', categoryController.add);
api.get('/getCategories', categoryController.getCategories)
api.get('/getCategory/:id', categoryController.getCategory)
api.put('/update/:id', categoryController.updatCategory)
api.delete('/delete/:id', categoryController.deleteCategory)
module.exports = api;

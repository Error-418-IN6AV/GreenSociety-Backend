'use strict'

const express = require('express');
const api = express.Router();
const categoryController = require('./category.cotroller')
const { ensureAuth } = require('../services/authenticated');

api.get('/test', categoryController.test);
api.post('/add', [ensureAuth], categoryController.add);
api.get('/getCategories', [ensureAuth], categoryController.getCategories)
api.get('/getCategory/:id', [ensureAuth], categoryController.getCategory)
api.put('/update/:id', [ensureAuth], categoryController.updatCategory)
api.delete('/delete/:id', [ensureAuth], categoryController.deleteCategory)
module.exports = api;
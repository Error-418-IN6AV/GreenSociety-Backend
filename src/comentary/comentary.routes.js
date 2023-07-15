'use strict'

const express = require('express');

const api = express.Router();
const commentController = require('./comentary.controller');
const { ensureAuth, isAdmin } = require('../services/authenticated');

api.post('/add', [ensureAuth],commentController.add);
 api.get('/get/:id', [ensureAuth],commentController.get); 
api.get('/getComment/:comentaryId', [ensureAuth],commentController.getCommment);
api.get('/getCommmentaries', [ensureAuth],commentController.getCommmentaries);
api.put('/update/:id', [ensureAuth],commentController.update);
api.put('/updateLike/:id',commentController.updateLike)
api.put('/updateDislike/:id',commentController.updateDislike)
api.delete('/delete/:id', [ensureAuth],commentController.delete); 


module.exports = api;
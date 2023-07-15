'use strict'

const express = require('express');

const api = express.Router();
const foroController = require('./foro.contoller');
const { ensureAuth, isAdmin } = require('../services/authenticated');

api.post('/add',foroController.add);
 api.get('/get', [ensureAuth],foroController.get); 
api.get('/getForo/:id', [ensureAuth],foroController.getForo);
api.put('/update/:id', [ensureAuth],foroController.update);

api.delete('/delete/:id', [ensureAuth],foroController.delete); 


module.exports = api;
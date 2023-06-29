'use strict'

const express = require('express');
const api = express.Router();
const detalleDonacionesController = require('./detalleDonacion.controller');
const { ensureAuth } = require('../services/authenticated');

api.get('/',  detalleDonacionesController.test);
api.post('/add', ensureAuth, detalleDonacionesController.add);
api.get('/gets', ensureAuth, detalleDonacionesController.get)
api.get('/get/:id', ensureAuth, detalleDonacionesController.getId);
api.put('/update/:id', ensureAuth, detalleDonacionesController.update);
api.delete('/delete/:id', ensureAuth, detalleDonacionesController.delete);
module.exports = api;
'use strict'

const express = require('express');
const api = express.Router();
const donacionesController = require('./donaciones.controller');
const { ensureAuth } = require('../services/authenticated');

api.get('/',  donacionesController.test);
api.post('/add', ensureAuth, donacionesController.add );
api.get('/getsMy', ensureAuth, donacionesController.getMyDonations);
api.get('/getToMe', ensureAuth, donacionesController.getDonationsToMe);
api.get('/get/:id', ensureAuth, donacionesController.getById);
api.put('/update/:id', ensureAuth, donacionesController.update);
api.delete('/delete/:id', ensureAuth, donacionesController.delete);
module.exports = api;
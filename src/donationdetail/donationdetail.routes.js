'use strict'

const express = require('express');
const api = express.Router();
const donationdetailController = require('./donationdetail.controller');
const { ensureAuth } = require('../services/authenticated');

api.get('/', donationdetailController.test);
api.post('/add', [ensureAuth], donationdetailController.add);
api.get('/gets', [ensureAuth], donationdetailController.get)
api.get('/get/:id', [ensureAuth], donationdetailController.getId);
api.put('/update/:id', [ensureAuth], donationdetailController.update);
api.delete('/delete/:id', [ensureAuth], donationdetailController.delete);
module.exports = api;
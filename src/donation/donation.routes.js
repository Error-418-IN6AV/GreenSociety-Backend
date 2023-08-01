'use strict'

const express = require('express');
const api = express.Router();
const donationController = require('./donation.controller');
const { ensureAuth } = require('../services/authenticated');

api.get('/', donationController.test);
api.post('/add', [ensureAuth], donationController.add);
api.get('/getsMy', [ensureAuth], donationController.getMyDonations);
api.get('/getToMe', [ensureAuth], donationController.getDonationsToMe);
api.get('/get/:id', [ensureAuth], donationController.getById);
api.put('/update/:id', [ensureAuth], donationController.update);
api.delete('/delete/:id', [ensureAuth], donationController.delete);
module.exports = api;
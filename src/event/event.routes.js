'use strict'

const express = require('express');
const api = express.Router();
const eventController = require('./event.controller');
const { ensureAuth, isAdmin } = require('../services/authenticated');

api.get('/test', eventController.testEvent);
api.post('/add', [ensureAuth, isAdmin], eventController.addEvent);
api.get('/get', [ensureAuth], eventController.getEvent);
api.get('/get/:id', [ensureAuth], eventController.getevent);
api.put('/update/:id', [ensureAuth, isAdmin], eventController.updateEvent);
api.delete('/delete/:id', [ensureAuth, isAdmin], eventController.deleteEvent);

module.exports = api;
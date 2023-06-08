'use strict'

const express = require('express');
const api = express.Router();
const donacionesController = require('./donaciones.controller');

api.get('/',  donacionesController.test);
module.exports = api;
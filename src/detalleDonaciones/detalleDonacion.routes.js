'use strict'

const express = require('express');
const api = express.Router();
const detalleDonacionesController = require('./detalleDonacion.controller');

api.get('/',  detalleDonacionesController.test);
module.exports = api;
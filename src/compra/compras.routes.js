'use strict';

// Importar el módulo 'express'
const express = require('express');

// Crear un enrutador para las rutas relacionadas con compras
const api = express.Router();

// Importar el controlador de compras
const comprasController = require('./compras.controller');

// Importar el middleware de autenticación
const { ensureAuth } = require('../services/authenticated');

//Ruta para agregar una nueva compra.
//Se requiere autenticación del usuario.
api.post('/add', [ensureAuth], comprasController.add);

//Ruta para obtener la factura de compras de un usuario específico.
//Se requiere autenticación del usuario.
api.get('/getBill', [ensureAuth], comprasController.getBill);

// Exportar el enrutador para su uso en la aplicación principal.
module.exports = api;

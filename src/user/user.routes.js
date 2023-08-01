'use strict';

// Importar el módulo 'express'
const express = require('express');

// Crear un enrutador para las rutas relacionadas con usuarios
const api = express.Router();

// Importar el controlador de usuarios
const userController = require('./user.controller');

// Importar los middleware de autenticación
const { ensureAuth, isAdmin } = require('../services/authenticated');

//Ruta de prueba para verificar el funcionamiento básico de la API.
api.get('/test', userController.test);

//Ruta para registrar un nuevo usuario.
api.post('/register', userController.register);

//Rutas para graficas de forma ascedente a descendente.
api.get('/getClient', [ensureAuth], userController.getClient);
api.get('/getClientss', [ensureAuth], userController.getClientss);

//Ruta para autenticar a un usuario y generar un token de acceso.
api.post('/login', userController.login);

//Ruta para obtener los detalles de un usuario específico por su ID.
//Se requiere autenticación y que el usuario sea administrador.
api.get('/get/:id', [ensureAuth, isAdmin], userController.getUser);

//Ruta para obtener una lista de usuarios.
api.get('/get', userController.getUsers);

//Ruta para obtener una lista de usuarios colaboradores.
//Se requiere autenticación y que el usuario sea administrador.
api.get('/getCollaborator', [ensureAuth, isAdmin], userController.getCollaborator);

//Ruta para actualizar los datos de un usuario específico por su ID.
//Se requiere autenticación y que el usuario sea administrador.
api.put('/update/:id', [ensureAuth, isAdmin], userController.update);

//Ruta para eliminar un usuario específico por su ID.
//Se requiere autenticación y que el usuario sea administrador.
api.delete('/delete/:id', [ensureAuth, isAdmin], userController.deleteUser);

//Ruta para guardar un nuevo usuario.
//Se requiere autenticación y que el usuario sea administrador.
api.post('/save', [ensureAuth, isAdmin], userController.save);

// Exportar el enrutador para su uso en la aplicación principal.
module.exports = api;

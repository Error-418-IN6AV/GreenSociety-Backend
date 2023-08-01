'use strict'

require('dotenv').config()
const mongoConfig = require('./configs/mongo');
const app = require('./configs/app');
const userController = require('./src/user/user.controller')
const category = require('./src/category/category.cotroller')

mongoConfig.connect();
app.initServer();
userController.userAdmin();
category.defaultCategory()
'use strict'

const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3500;
const donacionesRoutes = require('../src/donaciones/donaciones.routes')
const detalleDonacionesRoutes = require('../src/detalleDonaciones/detalleDonacion.routes')
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use('/donaciones', donacionesRoutes);
app.use('/detalleDonaciones', detalleDonacionesRoutes)

exports.initServer = ()=>{
    app.listen(port);
    console.log(`Server http running in port ${port}`);
} 
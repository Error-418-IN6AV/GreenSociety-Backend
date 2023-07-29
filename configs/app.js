'use strict'

const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3500;
const foroRoutes = require('../src/foro/foro.routes')

app.use(express.urlencoded({extended: false}));
app.use(express.json());
////////////////////Solo esto hay que agregar
const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true, // Permite enviar las credenciales (cookies, encabezados de autorización) junto con la solicitud.
  };
  
 app.use(cors(corsOptions));

 ///////////////////////////
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use('/foro',foroRoutes)
exports.initServer = ()=>{
    app.listen(port);
    console.log(`Server http running in port ${port}`);
} 
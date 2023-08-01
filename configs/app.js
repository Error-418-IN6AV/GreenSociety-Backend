'use strict'

const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
const userRoutes = require('../src/user/user.routes');
const foroRoutes = require('../src/foro/foro.routes');
const comentaryRoutes = require('../src/comentary/comentary.routes');
const donationdetailRoutes = require('../src/donationdetail/donationdetail.routes');
const donationRoutes = require('../src/donation/donation.routes');
const categoryRoutes = require('../src/category/category.routes');
const productRoutes = require('../src/product/product.routes');
const compraRoutes = require('../src/compra/compras.routes');
const eventRoutes = require('../src/event/event.routes');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// Configuración CORS para permitir solicitudes desde http://localhost:5173
const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
};

app.use(cors(corsOptions));
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use('/foro', foroRoutes);
app.use('/user', userRoutes);
app.use('/comment', comentaryRoutes)
app.use('/detalledonaciones', donationdetailRoutes);
app.use('/donaciones', donationRoutes);
app.use('/category', categoryRoutes);
app.use('/product', productRoutes);
app.use('/compra', compraRoutes);
app.use('/event', eventRoutes);

exports.initServer = () => {
    app.listen(port);
    console.log(`Server http running in port ${port}`);
} 
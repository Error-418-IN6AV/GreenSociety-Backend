'use strict'

const Product = require('../product/product.model')
const Compra = require('./compras.model')
const User = require('../user/user.model')

exports.add = async (req, res) => {
    try {
        // Obtener los datos del cuerpo de la solicitud.
        let data = req.body;
        // Obtener el ID del usuario que realiza la compra desde el token de autenticación.
        let user = req.user.sub;
        // Verificar si el producto especificado por el ID existe en la base de datos.
        let existProducto = await Product.findOne({ _id: data.product });
        // Asignar el ID del usuario que realiza la compra al campo "user" en los datos de la compra.
        data.user = req.user.sub;
        // Asignar el nombre del producto y sus datos relacionados al objeto de compra.
        data.producto = existProducto.name;
        data.descuento = existProducto.descuento;
        data.precioInicial = existProducto.price;
        // Validar el número de NIT proporcionado por el cliente.
        if (data.nit.length >= 9) return res.send({ message: 'Your NIT is invalid' });
        if (data.nit.length == 0) {
            data.nit = 'C/F';
        } else if (data.nit.length <= 7 && data.nit.length >= 1) {
            return res.send({ message: 'Your NIT is invalid' });
        }
        // Validar la cantidad de productos solicitados por el cliente.
        if (isNaN(data.cantidad)) {
            data.cantidad = 1;
        } else if (data.cantidad == 0) {
            data.cantidad = 1;
        }
        //Valida el usuario y le suma 1 movimiento en cada compra
        let existUser = await User.findOne({ _id: user });
        let movimiento = existUser.movements + 1;
        let UpdateMovements = await User.findOneAndUpdate({ _id: user }, { movements: movimiento }, { new: true });
        // Calcular el precio total de la compra.
        let precioFinal = data.precioInicial * data.cantidad;
        data.total = precioFinal;
        // Verificar si el producto está disponible en stock para la cantidad solicitada.
        if (existProducto.stock == 0) {
            return res.send({ message: 'We are sorry but this product is currently out of stock.' });
        } else if (data.cantidad > existProducto.stock) {
            return res.send({ message: 'We are sorry but the quantity you are requesting exceeds what we have in our store.' });
        }
        // Crear un nuevo objeto "Compra" con los datos proporcionados y guardar en la base de datos.
        let compra = new Compra(data);
        await compra.save();
        // Responder al cliente con un mensaje de éxito y los detalles de la compra agregada.
        return res.send({ message: 'Compra added successfully', compra });
    } catch (err) {
        // Si se produce un error durante el proceso, manejarlo adecuadamente.
        console.error(err);
        return res.status(500).send({ message: 'Error creating Compra', error: err.message });
    }
}

exports.getBill = async (req, res) => {
    try {
        // Obtener el ID del usuario autenticado desde el token (obtenido a través del middleware de autenticación)
        let user = req.user.sub;
        // Buscar si existe una compra asociada al usuario en la base de datos
        let existUser = await Compra.findOne({ user: user });
        // Verificar si existe una compra asociada al usuario y si el usuario es el propietario de esa compra
        if (existUser) {
            if (existUser.user != user) {
                return res.status(401).send({ message: 'Don\'t have permission to do this action' });
            }
        }
        // Buscar todas las compras asociadas al usuario en la base de datos
        let compra = await Compra.find({ user: user });
        // Verificar si se encontraron compras asociadas al usuario
        if (!compra) {
            return res.status(404).send({ message: 'Bill not found' });
        }
        // Enviar una respuesta exitosa con el mensaje de éxito y la factura de compras del usuario.
        return res.send({ message: 'Bill found:', compra });
    } catch (err) {
        // En caso de un error interno, registrar el error y enviar una respuesta con un mensaje de error y código de estado 500 (Error del servidor).
        console.error(err);
        return res.status(500).send({ message: 'Error getting Bill' });
    }
}

exports.getProducts = async (req, res) => {
    try {
        // Obtener los datos del cuerpo de la solicitud (data) y el ID del usuario autenticado desde el token (user)
        let data = req.body;
        let user = req.user.sub;
        // Buscar si existen compras asociadas al usuario y al producto proporcionado en la base de datos
        let existCompra = await Compra.find({ user: user, product: data.product });
        // Enviar una respuesta con el mensaje de éxito y los productos comprados por el usuario encontrados.
        return res.send({ message: 'Products found', existCompra });
    } catch (err) {
        // En caso de un error interno, registrar el error y enviar una respuesta con un mensaje de error y código de estado 500 (Error del servidor).
        console.error(err);
        return res.status(500).send({ message: 'Error getting products' });
    }
}
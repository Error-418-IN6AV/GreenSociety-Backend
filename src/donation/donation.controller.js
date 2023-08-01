'use strict'
const Donacion = require('./donation.model')
const User = require('../user/user.model')
const DetalleDonacion = require('../donationdetail/donationdetail.model')

exports.test = (req, res) => {
    res.send({ message: 'Funcion de prueba' })
}

//crear
exports.add = async (req, res) => {
    try {
        //Obtener la data del cuerpo de la solicitud
        let data = req.body;
        //Obtener el id del usuario jalando el token de autenticacion cuando se loguea
        let userId = req.user.sub
        //Validar que exista el beneficiario en DB
        const userExists = await User.exists({ _id: data.beneficiario });
        //Retornar un mensaje si no existe 
        if (!userExists) {
            return res.send({ message: 'Beneficiario doesnt exists' });
        }
        //Validar que exista el detalle de donacion en BD
        const detalleExist = await DetalleDonacion.exists({ _id: data.detalleDonacion });
        //Retornar un mensaje si no existe
        if (!detalleExist) {
            return res.send({ message: 'Detalle donacion doesnt exists' });
        }
        //Validar que no se done él mismo si en la data le llega su propio ID en el atributo donante
        if (data.beneficiario === userId) {
            return res.send({ message: 'You cannot donate yourself' });
        }
        //Poner la fecha actual de la creacion de la donacion en el campo Date del modelo
        data.date = Date.now()
        //En el campo donante jalar su id de cuando se loguea, por medio del token de autenticación
        data.donante = req.user.sub
        //Crear el objeto Donacion y guardarla en la DB
        let donacion = new Donacion(data);
        await donacion.save();
        //Responderle al cliente con un mensaje satisfactorio
        return res.status(201).send({ message: 'Donation created successfully' })
    } catch (err) {
        //Responder con un mensaje si en caso se produce un error.
        console.error(err);
        return res.status(500).send({ message: 'Error creando detalle de donacion' })
    }
}

//donaciones que he hecho
exports.getMyDonations = async (req, res) => {
    try {
        //Crear una constante donde jala el id de cuando se loguea por medio del token de autenticación
        const userId = req.user.sub;
        /* Buscar los datos por el campo donante y que coinsidan con el id anterior, posteriormente
        almacenarlos en una constante "donations" y mostrar de "donante" y "beneficiario" el name y de "detalleDonacion" la causa */
        const donations = await Donacion.find({ donante: userId }).populate('donante', 'name').populate('beneficiario', 'name').populate('detalleDonacion', 'causa');;
        //Retornar un mensaje si no se encontraron
        if (!donations) {
            return res.status(404).send({ message: 'Donaciones not found' });
        }
        //Retornar los datos encontrados por medio de la constante donde se almacenaron
        return res.send({ message: 'Donations found', donations });
    } catch (err) {
        //Retornar un mensaje de error si existiera el caso
        console.error(err);
        return res.status(500).send({ message: 'Error getting donations' });
    }
}

//donaciones que me han hecho
exports.getDonationsToMe = async (req, res) => {
    try {
        //Crear una constante donde jala el id de cuando se loguea por medio del token de autenticación
        const userId = req.user.sub;
        /* Buscar los datos por el campo beneficiario y que coinsidan con el id anterior, posteriormente
        almacenarlos en una constante "donations" y mostrar de "donante" y "beneficiario" el name y de "detalleDonacion" la causa */
        const donations = await Donacion.find({ beneficiario: userId }).populate('donante', 'name').populate('beneficiario', 'name').populate('detalleDonacion', 'causa');;
        //Retornar un mensaje si no se encontraron
        if (!donations) {
            return res.status(404).send({ message: 'Donaciones not found' });
        }
        //Retornar los datos encontrados por medio de la constante donde se almacenaron
        return res.send({ message: 'Donations found', donations });
    } catch (err) {
        //Retornar un mensaje de error si existiera el caso
        console.error(err);
        return res.status(500).send({ message: 'Error getting donations' });
    }
}

//Buscar por id
exports.getById = async (req, res) => {
    try {
        //Obtener el id de los datos que se va a buscar
        let donacionId = req.params.id;
        //Buscar las donaciones por el campo _id y que coinsidan con donacionId y almacenarlo en la variable
        let donacion = await Donacion.findOne({ _id: donacionId });
        //Valido que exista 
        if (!donacion) return res.status(404).send({ message: 'Donation not found' });
        //Retornar los datos encontrados por medio de la constante donde se almacenaron
        return res.send({ message: 'Donation found:', donacion });
    } catch (err) {
        //Retornar un mensaje de error si existiera el caso
        console.error(err);
        return res.status(500).send({ message: 'Error getting Donation' });
    }
}


exports.update = async (req, res) => {
    try {
        //Obtener el id de los datos que se va a buscar
        let donacionId = req.params.id;
        //Obtener la data a actualizar
        let data = req.body;
        //Crear una constante donde jala el id de cuando se loguea por medio del token de autenticación
        let userId = req.user.sub
        //validar que exista el detalle donacion en DB
        const detalleExist = await DetalleDonacion.exists({ _id: data.detalleDonacion });
        //Retornar un mensaje si no existe
        if (!detalleExist) {
            return res.send({ message: 'Detalle donacion doesnt exists' });
        }
        // validar que no me done yo mismo
        if (data.beneficiario === userId) {
            return res.send({ message: 'You cannot donate yourself' });
        }
        //Actualizar la fecha a la fecha actual de la hora que se actualizo
        data.date = Date.now();
        //Actualizar
        let updatedDonacion = await Donacion.findOneAndUpdate(
            { _id: donacionId },
            data,
            { new: true }
        )
        //Retornar un mensaje si no se pudo actualizar
        if (!updatedDonacion) return res.send({ message: 'Donation not updated or not found' });
        //Retornar un mensaje satisfactorio al cliente con la nueva actualizacion
        return res.send({ message: 'Donation updated successfully', updatedDonacion });
    } catch (err) {
        //Retornar un mensaje de error si existiera el caso
        console.error(err);
        return res.status(500).send({ message: 'Error updated donation' });
    }
}

exports.delete = async (req, res) => {
    try {
        //Obtener el id de los datos que se va a eliminar
        let donacionId = req.params.id;
        //Eliminar
        let deletedDonation = await Donacion.findOneAndDelete({ _id: donacionId });
        //Retornar un mensaje si no se pudo eliminar
        if (!deletedDonation) return res.status(404).send({ message: 'Error deleting donation or already deleted' });
        //Retornar un mensaje satisfactorio con los datos eliminados
        return res.send({ message: 'Donation deleted successfully', deletedDonation });
    } catch (err) {
        //Retornar un mensaje de error si existiera el caso
        console.error(err)
        return res.status(500).send({ message: 'Error deleting donations' })
    }
}
'use strict'
const DetalleDonacion = require('./donationdetail.model')

exports.test = (req, res) => {
    res.send({ message: 'Funcion de prueba' })
}

//crear
exports.add = async (req, res) => {
    try {
        //Obtener la data del cuerpo de la solicitud
        let data = req.body;
        //Validar duplicados en el campo causa
        let existDetalleDonacion = await DetalleDonacion.findOne({ causa: data.causa });
        //Retornar un mensaje si ya existe
        if (existDetalleDonacion) {
            return res.send({ message: 'Detalle donacion ya existe' })
        }
        //Crear el datalleDonacion
        let detalleDonacion = new DetalleDonacion(data);
        await detalleDonacion.save();
        //Responderle al cliente con un mensaje satisfactorio
        return res.status(201).send({ message: 'Detalle donacion creada satisfactoriamente' })
    } catch (err) {
        //Responder con un mensaje si en caso se produce un error.
        console.error(err);
        return res.status(500).send({ message: 'Error creando detalle de donacion' })
    }
}

//Obtener todos
exports.get = async (req, res) => {
    try {
        //Buscar todos los datos y almacenarlos en una variable
        let detalleDonaciones = await DetalleDonacion.find().populate('causa');
        //Responder con esos datos encontrados por medio de esa variable junto con un mensaje
        return res.send({ message: 'Detalle de donaciones encontradas', detalleDonaciones })
    } catch (err) {
        //Responder con un mensaje si en caso se produce un error.
        console.error(err);
        return res.status(500).send({ message: 'Error obteniendo detalle de donaciones' });
    }
}

//Obtener por id
exports.getId = async (req, res) => {
    try {
        //Obtener el id de los datos que se va a buscar
        let detalleId = req.params.id;
        //Buscar los datos por el campo _id y que coinsidan con detalleId y almacenarlo en la variable
        let detalle = await DetalleDonacion.findOne({ _id: detalleId });
        //Valido que exista 
        if (!detalle) return res.status(404).send({ message: 'Detalle de donacion no encontrada' });
        //Responder con esos datos por medio de la variable junto con un mensaje
        return res.send({ message: 'Detalle donacion encontrada', detalle })
    } catch (err) {
        //Responder con un mensaje si en caso se produce un error.
        console.error(err);
        return res.status(500).send({ message: 'Error obteniendo detalle donacion' });
    }
}

//editar
exports.update = async (req, res) => {
    try {
        //Obtener el id de los datos que se van a editar
        let detalleId = req.params.id;
        //Obtener la data a actualizar
        let data = req.body;
        //Actualizar
        let updatedDetalle = await DetalleDonacion.findOneAndUpdate(
            { _id: detalleId },
            data,
            { new: true }
        )
        //Responder con un mensaje si no se pudo actualizar
        if (!updatedDetalle) return res.send({ message: 'Detalle de donaciones no encontrado ni editado' });
        //Responder con los datos actualizados y un mensaje satisfactorio
        return res.send({ message: 'Detalle donaciones editado:', updatedDetalle });
    } catch (err) {
        //Responder con un mensaje si en caso se produce un error.
        console.error(err);
        return res.status(500).send({ message: 'Error editando detalle de donaciones' });
    }
}

//eliminar
exports.delete = async (req, res) => {
    try {
        //Obtener el id de los datos que se van a eliminar
        let detalleId = req.params.id;
        //Eliminar
        let deletedDetalle = await DetalleDonacion.findOneAndDelete({ _id: detalleId });
        //Retornar un mensaje si no se pudo eliminar
        if (!deletedDetalle) return res.status(404).send({ message: 'Error eliminando detalle donaciones o ya fue eliminado' });
        //Retornar un mensaje satisfactorio con los datos eliminados
        return res.send({ message: 'Detalle donaciones eliminado satisfactoriamente', deletedDetalle });
    } catch (err) {
        //Responder con un mensaje si en caso se produce un error.
        console.error(err)
        return res.status(500).send({ message: 'Error eliminando detalle donaciones' })
    }
}
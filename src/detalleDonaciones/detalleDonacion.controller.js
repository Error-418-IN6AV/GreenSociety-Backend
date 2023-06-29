'use strict'
const DetalleDonacion = require('./detalleDonacion.model')

exports.test = (req, res)=>{
    res.send({message: 'Funcion de prueba'})
}

exports.add = async(req, res)=>{ 
    try{
        let data = req.body;
        //Validar duplicados
        let existDetalleDonacion = await DetalleDonacion.findOne({causa: data.causa});
        if(existDetalleDonacion) {
            return res.send({message: 'Detalle donacion ya existe'})
        }
        let detalleDonacion = new DetalleDonacion(data);
        await detalleDonacion.save();
        return res.status(201).send({message: 'Detalle donacion creada satisfactoriamente'})
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error creando detalle de donacion'})
    }
}

exports.get = async(req, res)=>{
    try{
        let detalleDonaciones = await DetalleDonacion.find();
        return res.send({message: 'Detalle de donaciones encontradas', detalleDonaciones})
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error obteniendo detalle de donaciones'});
    }
}

exports.getId = async(req, res)=>{
    try{
        let detalleId = req.params.id;
        let detalle = await DetalleDonacion.findOne({_id: detalleId});
        if(!detalle) return res.status(404).send({message: 'Detalle de donacion no encontrada'});
        return res.send({message: 'Detalle donacion encontrada', detalle})
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error obteniendo detalle donacion'});
    }
}

exports.update = async(req, res)=>{
    try{
        let detalleId = req.params.id;
        let data = req.body;
        //Validar duplicados
        let existDetalleDonacion = await DetalleDonacion.findOne({causa: data.causa});
        if(existDetalleDonacion) {
            return res.send({message: 'Detalle donacion ya existe'})
        }
        //Actualizar
        let updatedDetalle = await DetalleDonacion.findOneAndUpdate(
            {_id: detalleId},
            data,
            {new: true}
        )
        if(!updatedDetalle) return res.send({message: 'Detalle de donaciones no encontrado ni editado'});
        return res.send({message: 'Detalle donaciones editado:', updatedDetalle});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error editando detalle de donaciones'});
    }
}

exports.delete = async(req, res)=>{
    try{
        let detalleId = req.params.id;
        let deletedDetalle = await DetalleDonacion.findOneAndDelete({_id: detalleId});
        if(!deletedDetalle) return res.status(404).send({message: 'Error eliminando detalle donaciones o ya fue eliminado'});
        return res.send({message: 'Detalle donaciones eliminado satisfactoriamente', deletedDetalle});
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error eliminando detalle donaciones'})
    }
}
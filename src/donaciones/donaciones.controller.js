'use strict'
const Donacion = require('./donaciones.model')
const User = require('../user/user.model')
const DetalleDonacion = require('../detalleDonaciones/detalleDonacion.model')

exports.test = (req, res)=>{
    res.send({message: 'Funcion de prueba'})
}

exports.add = async(req, res)=>{ 
    try{
        let data = req.body;
        //let user = req.user.sub 
        //validar que exista el beneficiario
        const userExists = await User.exists({ _id: data.beneficiario });
        if (!userExists) {
            return res.send({ message: 'Beneficiario doesnt exists' });
        }
        //validar que exista el detalle
        const detalleExist = await DetalleDonacion.exists({ _id: data.detalleDonacion });
        if (!detalleExist) {
            return res.send({ message: 'Detalle donacion doesnt exists' });
        }
        data.date = Date.now()
        data.donante = req.user.sub
        let donacion = new Donacion(data);
        await donacion.save();
        return res.status(201).send({message: 'Donation created successfully'})
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error creando detalle de donacion'})
    }
}

//donaciones que he hecho
exports.getMyDonations = async(req, res)=>{
    try{      
        const userId = req.user.sub;
        const donations = await Donacion.find({ donante: userId });
        if (!donations) {
            return res.status(404).send({ message: 'Donaciones not found' });
        }
        return res.send({ message: 'Donations found', donations });
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error getting donations'});
    }
}

//donaciones que he recibido
exports.getDonationsToMe = async(req, res)=>{
    try{      
        const userId = req.user.sub;
        const donations = await Donacion.find({ beneficiario: userId });
        if (!donations) {
            return res.status(404).send({ message: 'Donaciones not found' });
        }
        return res.send({ message: 'Donations found', donations });
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error getting donations'});
    }
}

exports.getById = async(req, res)=>{
    try{
        let donacionId = req.params.id;
        let donacion = await Donacion.findOne({_id: donacionId});
        //Valido que exista 
        if(!donacion) return res.status(404).send({message: 'Donation not found'});
        return res.send({message: 'Donation found:', donacion});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error getting Donation'});
    }
}


exports.update = async(req, res)=>{
    try{
        let donacionId = req.params.id;
        let data = req.body;
        //validar que exista el beneficiario
        const userExists = await User.exists({ _id: data.beneficiario });
        if (!userExists) {
            return res.send({ message: 'Beneficiario doesnt exists' });
        }
        //validar que exista el detalle
        const detalleExist = await DetalleDonacion.exists({ _id: data.detalleDonacion });
        if (!detalleExist) {
            return res.send({ message: 'Detalle donacion doesnt exists' });
        }
        //Actualizar
        data.date = Date.now();
        let updatedDonacion = await Donacion.findOneAndUpdate(
            {_id: donacionId},
            data,
            {new: true}
        )
        if(!updatedDonacion) return res.send({message: 'Donation not updated or not found'});
        return res.send({message: 'Donation updated successfully', updatedDonacion});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error updated donation'});
    }
}

exports.delete = async(req, res)=>{
    try{
        let donacionId = req.params.id;
        let deletedDonation = await Donacion.findOneAndDelete({_id: donacionId});
        if(!deletedDonation) return res.status(404).send({message: 'Error deleting donation or already deleted'});
        return res.send({message: 'Donation deleted successfully', deletedDonation});
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error deleting donations'})
    }
}
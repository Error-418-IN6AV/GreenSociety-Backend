'use strict'
 

const Foro = require('./foro.model');
const User = require('../user/user.model');



exports.add = async(req, res)=>{
    try{
        let data = req.body;
        data.user = req.user.sub
        let foro = new Foro(data);
        await foro.save();
        return res.send({message: 'Comentary added sucessfully'});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error creating Comentary', error: err.message})
    }
}

exports.get = async(req, res)=>{
    try{

        let comentary = await Foro.find()
        return res.send({message: 'Comentairies found', comentary});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error getting comentaries'});
    }
}

exports.getForo = async(req, res)=>{
    try{      
        let foroId = req.params.id;
        let user = req.user.sub
        let existUser = await Foro.findOne({_id: foroId});
        if(existUser) {
            if(existUser.user != user) return res.status(401).send({message: 'Dont have permission to do this action'});
        }
        let comentary = await Foro.findOne({_id: foroId})
        if(!comentary) return res.status(404).send({message: 'Comentary not found'});
        return res.send({message: 'Comentary found:', comentary});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error getting Room'});
    }
}




exports.update = async(req, res)=>{
    try{
        let foroId = req.params.id;
        let data = req.body;
        let user = req.user.sub
        let existUser = await Foro.findOne({_id: foroId});
       
        if(existUser) {
            if(existUser.user != user) return res.status(401).send({message: 'Dont have permission to do this action'});
          
       
            let updatedForo = await Foro.findOneAndUpdate(
                {_id: foroId},
                data,
                {new: true}
            )
          
            if(!updatedForo) return res.status(401).send({message: 'Comentary not found and not updated'});
            return res.send({message: 'Comentary updated', updatedForo});
        }
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error searching room'});
    }
}


exports.delete = async(req, res)=>{
    try{
        let idForo = req.params.id;
        let user = req.user.sub
        let existUser = await Foro.findOne({_id: idForo});
       
        if(existUser) {
            if(existUser.user != user) return res.status(401).send({message: 'Dont have permission to do this action'});
        }
        let deletedForo= await Foro.findOneAndDelete({_id: idForo});
        if(!deletedForo) return res.status(404).send({message: 'Error removing  Comentary  or already deleted'});
        return res.send({message: 'Foro deleted sucessfully', deletedForo});
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error removing room'})
    }
}
'use strict'
 

const Foro = require('./foro.model');
const User = require('../user/user.model');
const Comment = require ('../comentary/comentary.model')


exports.add = async(req, res)=>{
    try{
        let data = req.body;
        let foro = new Foro(data);
        await foro.save();
        return res.send({message: 'foro added sucessfully'});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error creating foro', error: err.message})
    }
}

exports.get = async(req, res)=>{
    try{

        let foro = await Foro.find()
        return res.send({message: 'Foros found', foro});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error getting comentaries'});
    }
}

exports.getForo = async(req, res)=>{
    try{      
        let foroId = req.params.id;
        let foro = await Foro.findOne({_id: foroId})
        if(!foro) return res.status(404).send({message: 'Foro not found'});
        return res.send({message: 'foro found:', foro});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error getting Foro'});
    }
}




exports.update = async(req, res)=>{
    try{
        let foroId = req.params.id;
        let data = req.body;
          
            let updatedForo = await Foro.findOneAndUpdate(
                {_id: foroId},
                data,
                {new: true}
            )
          
            if(!updatedForo) return res.status(401).send({message: 'Foro not found and not updated'});
            return res.send({message: 'Foro updated', updatedForo});
  
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error searching foro'});
    }
}


exports.delete = async(req, res)=>{
    try{
        let idForo = req.params.id;

        let existUser = await Foro.findOne({_id: idForo});
        let deletedForo= await Foro.findOneAndDelete({_id: idForo});
        let deleteComentaries= await Comment.deleteMany({foro:idForo});
        if(!deleteComentaries) return res.status(404).send({message: 'Error removing  Comentary  or already deleted'});
        if(!deletedForo) return res.status(404).send({message: 'Error removing  foro  or already deleted'});
        return res.send({message: 'Foro deleted sucessfully', deletedForo});
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error removing Foro'})
    }
}
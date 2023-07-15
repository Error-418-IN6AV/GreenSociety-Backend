'use strict'
 

const Foro = require('../foro/foro.model');
const User = require('../user/user.model');
const Comment = require ('../comentary/comentary.model')


exports.add = async (req, res) => {
    try {
      let data = req.body;
      let user = req.user.sub;
      data.user = req.user.sub;
      let existUser = await User.findOne({ _id: user });
      data.name = existUser.name;
  
      // Verificar si la descripción está vacía o nula
      if (!data.description) {
        data.description = `Hola soy ${data.name}`; // Asignar un valor por defecto
      }
  
      let comentary = new Comment(data);
      await comentary.save();
      return res.send({ message: 'Comentary added successfully', comentary });
    } catch (err) {
      console.error(err);
      return res.status(500).send({ message: 'Error creating Comentary', error: err.message });
    }
  };
  
exports.get = async(req, res)=>{
    try{
        let foroId = req.params.id;
        let comentary = await Comment.find({foro:foroId})
        return res.send({message: 'Comentairies found', comentary});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error getting comentaries'});
    }
}

exports.getCommment = async (req, res) => {
    try {
      let comentaryId = req.params.id;
 
  
      let existCommentary = await Comment.findOne({ _id: comentaryId });
      if (!existCommentary) {
        return res.status(404).send({ message: 'Comentary not found' });
      }

  
      return res.send({ message: 'Comentary found', comentary: existCommentary });
    } catch (err) {
      console.error(err);
      return res.status(500).send({ message: 'Error getting Comentary', error: err.message });
    }
  };
  
exports.getCommmentaries = async(req, res)=>{
    try{      
        let user = req.user.sub
        let existUser = await Comment.find({user: user});
        if(!existUser) return res.status(404).send({message: 'Comentary not found'});
        return res.send({message: 'Comentary found:', existUser});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error getting Comentary'});
    }
}





exports.update = async(req, res)=>{
    try{
        let foroId = req.params.id;
        let data = req.body;
        let user = req.user.sub
        let existUser = await Comment.findOne({_id: foroId});
       
        if(existUser) {
            if(existUser.user != user) return res.status(401).send({message: 'Dont have permission to do this action'});
          
               }
            let updatedForo = await Comment.findOneAndUpdate(
                {_id: foroId},
                data,
                {new: true}
            )
          
            if(!updatedForo) return res.status(401).send({message: 'Comentary not found and not updated'});
            return res.send({message: 'Comentary updated', updatedForo});

    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error searching Comentary'});
    }
}


exports.updateLike = async (req, res) => {
    try {
      let commentId = req.params.id;
  
      let updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        { $inc: { like: 1 } },
        { new: true }
      );
  
      if (!updatedComment) return res.status(401).send({ message: 'Comment not found or not updated' });
  
      return res.send({ message: 'Comment updated', updatedComment });
    } catch (err) {
      console.error(err);
      return res.status(500).send({ message: 'Error updating comment' });
    }
  };
  exports.updateDislike = async (req, res) => {
    try {
      let commentId = req.params.id;
  
      let updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        { $inc: { dislike: 1 } },
        { new: true }
      );
  
      if (!updatedComment) return res.status(401).send({ message: 'Comment not found or not updated' });
  
      return res.send({ message: 'Comment updated', updatedComment });
    } catch (err) {
      console.error(err);
      return res.status(500).send({ message: 'Error updating comment' });
    }
  };
 
  
  
  
  
  
  
exports.delete = async(req, res)=>{
    try{
        let idForo = req.params.id;
        let user = req.user.sub
        let existUser = await Comment.findOne({_id: idForo});
       
        if(existUser) {
            if(existUser.user != user) return res.status(401).send({message: 'Dont have permission to do this action'});
        }
        let deletedForo= await Comment.findOneAndDelete({_id: idForo});
        if(!deletedForo) return res.status(404).send({message: 'Error removing  Comentary  or already deleted'});
        return res.send({message: 'Comentary deleted sucessfully', deletedForo});
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error removing Comentary'})
    }
}
'use strict'; // Modo estricto para una mejor práctica

const Foro = require('../foro/foro.model');
const User = require('../user/user.model');
const Comment = require('../comentary/comentary.model');

// Agrega un nuevo comentario en un foro, requiere autenticación del usuario
exports.add = async (req, res) => {
    try {
        let data = req.body; // Obtiene los datos del comentario desde el cuerpo de la solicitud
        let user = req.user.sub;
        data.user = req.user.sub;
        let existUser = await User.findOne({ _id: user }); // Busca al usuario en la base de datos
        data.name = existUser.name; // Asigna el nombre del usuario al campo 'name' del comentario

        // Verificar si la descripción está vacía o nula y asignar un valor predeterminado
        if (!data.description) {
            data.description = `Hola soy ${data.name}`;
        }

        let comentary = new Comment(data); // Crea un nuevo objeto Comment con los datos
        await comentary.save(); // Guarda el comentario en la base de datos
        return res.send({ message: 'Comentary added successfully', comentary });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error creating Comentary', error: err.message });
    }
};

// Obtiene todos los comentarios asociados a un foro específico
exports.get = async (req, res) => {
    try {
        let foroId = req.params.id; // Obtiene el ID del foro desde los parámetros de la solicitud
        let comentary = await Comment.find({ foro: foroId }); // Busca los comentarios que coinciden con el ID del foro
        return res.send({ message: 'Comentairies found', comentary });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error getting comentaries' });
    }
};

// Obtiene un comentario específico por su ID
exports.getCommment = async (req, res) => {
    try {
        let comentaryId = req.params.id; // Obtiene el ID del comentario desde los parámetros de la solicitud

        let existCommentary = await Comment.findOne({ _id: comentaryId }); // Busca el comentario en la base de datos
        if (!existCommentary) {
            return res.status(404).send({ message: 'Comentary not found' }); // Responde con un mensaje si el comentario no se encuentra
        }

        return res.send({ message: 'Comentary found', comentary: existCommentary });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error getting Comentary', error: err.message });
    }
};

// Obtiene todos los comentarios realizados por un usuario específico
exports.getCommmentaries = async (req, res) => {
    try {
        let user = req.user.sub; // Obtiene el ID del usuario autenticado desde el token
        let existUser = await Comment.find({ user: user }); // Busca los comentarios que corresponden al ID de usuario
        if (!existUser) return res.status(404).send({ message: 'Comentary not found' });
        return res.send({ message: 'Comentary found:', existUser });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error getting Comentary' });
    }
};

// Actualiza un comentario existente por su ID, requiere autenticación del usuario que lo creó
exports.update = async (req, res) => {
    try {
        let foroId = req.params.id; // Obtiene el ID del comentario desde los parámetros de la solicitud
        let data = req.body; // Obtiene los datos actualizados del comentario desde el cuerpo de la solicitud
        let user = req.user.sub; // Obtiene el ID del usuario autenticado desde el token
        let existUser = await Comment.findOne({ _id: foroId }); // Busca el comentario en la base de datos

        // Verifica si el usuario es el creador del comentario antes de actualizarlo
        if (existUser) {
            if (existUser.user != user) return res.status(401).send({ message: 'Dont have permission to do this action' });
        }

        let updatedForo = await Comment.findOneAndUpdate(
            { _id: foroId }, // Busca el comentario por su ID
            data, // Los datos actualizados
            { new: true } // Opción para devolver el comentario actualizado en lugar del antiguo
        );

        if (!updatedForo) return res.status(401).send({ message: 'Comentary not found and not updated' });
        return res.send({ message: 'Comentary updated', updatedForo });

    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error searching Comentary' });
    }
};

// Incrementa el contador de likes de un comentario específico por su ID
exports.updateLike = async (req, res) => {
    try {
        let commentId = req.params.id; // Obtiene el ID del comentario desde los parámetros de la solicitud

        let updatedComment = await Comment.findByIdAndUpdate(
            commentId, // Busca el comentario por su ID
            { $inc: { like: 1 } }, // Incrementa el contador de likes en 1
            { new: true } // Opción para devolver el comentario actualizado en lugar del antiguo
        );

        if (!updatedComment) return res.status(401).send({ message: 'Comment not found or not updated' });
        return res.send({ message: 'Comment updated', updatedComment });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error updating comment' });
    }
};

// Incrementa el contador de dislikes de un comentario específico por su ID
exports.updateDislike = async (req, res) => {
    try {
        let commentId = req.params.id; // Obtiene el ID del comentario desde los parámetros de la solicitud

        let updatedComment = await Comment.findByIdAndUpdate(
            commentId, // Busca el comentario por su ID
            { $inc: { dislike: 1 } }, // Incrementa el contador de dislikes en 1
            { new: true } // Opción para devolver el comentario actualizado en lugar del antiguo
        );

        if (!updatedComment) return res.status(401).send({ message: 'Comment not found or not updated' });
        return res.send({ message: 'Comment updated', updatedComment });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error updating comment' });
    }
};

// Elimina un comentario por su ID, requiere autenticación del usuario que lo creó
exports.delete = async (req, res) => {
    try {
        let idForo = req.params.id; // Obtiene el ID del comentario desde los parámetros de la solicitud
        let user = req.user.sub; // Obtiene el ID del usuario autenticado desde el token
        let existUser = await Comment.findOne({ _id: idForo }); // Busca el comentario en la base de datos

        // Verifica si el usuario es el creador del comentario antes de eliminarlo
        if (existUser) {
            if (existUser.user != user) return res.status(401).send({ message: 'Dont have permission to do this action' });
        }

        let deletedForo = await Comment.findOneAndDelete({ _id: idForo }); // Busca y elimina el comentario por su ID

        if (!deletedForo) return res.status(404).send({ message: 'Error removing  Comentary  or already deleted' });
        return res.send({ message: 'Comentary deleted sucessfully', deletedForo });
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error removing Comentary' })
    }
};

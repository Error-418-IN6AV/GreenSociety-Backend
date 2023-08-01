const Foro = require('./foro.model');
const User = require('../user/user.model');
const Comment = require('../comentary/comentary.model')

// Agrega un nuevo foro, solo lo puede hacer si el usuario tiene un rol de admin
exports.add = async (req, res) => {
    try {
        // Obtiene la información del foro desde el cuerpo de la solicitud
        let data = req.body;
        // Crea una nueva instancia del modelo Foro con los datos obtenidos
        let foro = new Foro(data);
        // Guarda el nuevo foro en la base de datos
        await foro.save();
        return res.send({ message: 'foro added successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error creating foro', error: err.message })
    }
}

// Obtiene todos los foros existentes en la base de datos
exports.get = async (req, res) => {
    try {
        // Busca y obtiene todos los documentos de foro en la base de datos
        let foro = await Foro.find()
        return res.send({ message: 'Foros found', foro });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error getting comentaries' });
    }
}

// Obtiene un foro específico por su ID
exports.getForo = async (req, res) => {
    try {
        // Obtiene el ID del foro desde los parámetros de la solicitud
        let foroId = req.params.id;
        // Busca el foro en la base de datos utilizando el ID
        let foro = await Foro.findOne({ _id: foroId })
        // Si el foro no existe, devuelve un mensaje de error
        if (!foro) return res.status(404).send({ message: 'Foro not found' });
        // Si el foro existe, lo devuelve en la respuesta con un mensaje de éxito
        return res.send({ message: 'foro found:', foro });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error getting Foro' });
    }
}

// Actualiza un foro existente por su ID
exports.update = async (req, res) => {
    try {
        // Obtiene el ID del foro desde los parámetros de la solicitud
        let foroId = req.params.id;
        // Obtiene los nuevos datos del foro desde el cuerpo de la solicitud
        let data = req.body;
        // Busca y actualiza el foro en la base de datos utilizando el ID y los nuevos datos
        let updatedForo = await Foro.findOneAndUpdate(
            { _id: foroId },
            data,
            { new: true }
        )
        // Si el foro no se encuentra, devuelve un mensaje de error
        if (!updatedForo) return res.status(401).send({ message: 'Foro not found and not updated' });
        // Si el foro se actualiza con éxito, lo devuelve en la respuesta con un mensaje de éxito
        return res.send({ message: 'Foro updated', updatedForo });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error searching foro' });
    }
}

// Elimina un foro por su ID, incluidos sus comentarios asociados
exports.delete = async (req, res) => {
    try {
        let idForo = req.params.id;
        let existUser = await Foro.findOne({ _id: idForo });
        // Elimina el foro por su ID
        let deletedForo = await Foro.findOneAndDelete({ _id: idForo });
        let deleteComentaries = await Comment.deleteMany({ foro: idForo });
        if (!deleteComentaries) return res.status(404).send({ message: 'Error removing Comentary or already deleted' });
        // Si hay un error al eliminar el foro, devuelve un mensaje de error
        if (!deletedForo) return res.status(404).send({ message: 'Error removing foro or already deleted' });
        // Si ambos se eliminan con éxito, devuelve el foro eliminado en la respuesta con un mensaje de éxito
        return res.send({ message: 'Foro deleted sucessfully', deletedForo });
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error removing Foro' })
    }
}

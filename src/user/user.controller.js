'use strict'

const User = require('./user.model');
const { validateData, encrypt, checkPassword } = require('../utils/validate');
const { createToken } = require('../services/jwt');

exports.test = (req, res) => {
    res.send({ message: 'Test function is running' });
}

exports.userAdmin = async () => {
    try {
        // Datos del administrador predeterminado
        let data = {
            name: 'ADMINB',
            surname: 'ADMINB',
            username: 'ADMINB',
            phone: '58554785',
            email: 'ADMINB@gmail.com',
            password: 'ADMINB',
            movements: '1',
            beneficiario: 'Si',
            role: 'ADMIN'
        }
        // Encriptar la contraseña antes de almacenarla en la base de datos (usando la función "encrypt")
        data.password = await encrypt(data.password);
        // Verificar si ya existe un administrador con el mismo nombre en la base de datos
        let existAdmin = await User.findOne({ name: 'ADMINB' });
        if (existAdmin) {
            return console.log('Default admin already created');
        }
        // Crear un nuevo objeto "User" con los datos del administrador y guardarlo en la base de datos
        let admin = new User(data);
        await admin.save();
        // Imprimir mensaje indicando que el administrador predeterminado ha sido creado exitosamente
        return console.log('Default admin created');
    } catch (err) {
        // En caso de un error interno, registrar el error y mostrarlo en la consola
        return console.error(err);
    }
}

exports.register = async (req, res) => {
    try {
        // Obtener los datos del cuerpo de la solicitud (request).
        let data = req.body;
        // Crear un objeto de parámetros que contiene la contraseña.
        let params = {
            password: data.password,
        }
        // Verificar si el nombre de usuario del cliente ya existe en la base de datos.
        let existUser = await User.findOne({ username: data.username });
        if (existUser) return res.status(404).send({ message: 'Client already exists' })
        // Verificar si el número de teléfono del cliente ya existe en la base de datos.
        let existphone = await User.findOne({ phone: data.phone });
        if (existphone) return res.status(404).send({ message: 'Client phone already exists' })
        // Verificar si el correo electrónico del cliente ya existe en la base de datos.
        let existemail = await User.findOne({ email: data.email });
        if (existemail) return res.status(404).send({ message: 'Client email already exists' })
        // Validar los datos enviados en el cuerpo de la solicitud.
        let validate = validateData(params);
        if (validate) return res.status(400).send(validate);
        // Configurar algunos valores predeterminados para el nuevo cliente.
        data.beneficiario = 'Si';
        data.role = 'CLIENT';
        data.movements = 1;
        // Encriptar la contraseña antes de almacenarla en la base de datos.
        data.password = await encrypt(data.password)
        // Crear un nuevo objeto "User" con los datos proporcionados y guardar en la base de datos.
        let user = new User(data);
        await user.save();
        // Responder al cliente con un mensaje de éxito.
        return res.send({ message: 'Account created successfully' });
    } catch (err) {
        // Si se produce un error durante el proceso, manejarlo adecuadamente.
        console.error(err);
        return res.status(500).send({ message: 'Error creating account', error: err.message })
    }
}

exports.save = async (req, res) => {
    try {
        // Obtener los datos del cuerpo de la solicitud (request).
        let data = req.body;
        // Verificar si el nombre de usuario del colaborador ya existe en la base de datos.
        let existUser = await User.findOne({ username: data.username });
        if (existUser) return res.status(404).send({ message: 'Collaborator already exists' })
        // Verificar si el número de teléfono del colaborador ya existe en la base de datos.
        let existphone = await User.findOne({ phone: data.phone });
        if (existphone) return res.status(404).send({ message: 'Collaborator phone already exists' })
        // Verificar si el correo electrónico del colaborador ya existe en la base de datos.
        let existemail = await User.findOne({ email: data.email });
        if (existemail) return res.status(404).send({ message: 'Collaborator email already exists' })
        // Crear un objeto de parámetros que contiene la contraseña.
        let params = {
            password: data.password,
        }
        // Validar los datos enviados en el cuerpo de la solicitud.
        let validate = validateData(params);
        if (validate) return res.status(400).send(validate);
        // Configurar algunos valores predeterminados para el nuevo colaborador.
        data.role = 'COLLABORATOR';
        data.beneficiario = 'Si';
        data.movements = 1;
        // Encriptar la contraseña antes de almacenarla en la base de datos.
        data.password = await encrypt(data.password);
        // Crear un nuevo objeto "User" con los datos proporcionados y guardar en la base de datos.
        let user = new User(data);
        await user.save();
        // Responder al cliente con un mensaje de éxito.
        return res.send({ message: 'Account created successfully' });
    } catch (err) {
        // Si se produce un error durante el proceso, manejarlo adecuadamente.
        console.error(err);
        return res.status(500).send({ message: 'Error saving Collaborator', error: err.message });
    }
}

exports.login = async (req, res) => {
    try {
        // Obtener los datos del cuerpo de la solicitud (username y password)
        let data = req.body;
        // Crear un objeto con las credenciales del usuario (username y password)
        let credentials = {
            username: data.username,
            password: data.password
        }
        // Validar los datos ingresados por el usuario
        let msg = validateData(credentials);
        if (msg) return res.status(400).send(msg);

        // Buscar al usuario en la base de datos por su nombre de usuario (username)
        let user = await User.findOne({ username: data.username });
        // Verificar si se encontró un usuario y si la contraseña es correcta
        if (user && await checkPassword(data.password, user.password)) {
            // Crear un objeto con la información del usuario que se enviará en la respuesta
            let userLogged = {
                name: user.name,
                surname: user.surname,
                username: user.username,
                role: user.role,
                _id: user._id
            }
            // Crear un token de autenticación para el usuario
            let token = await createToken(user);
            // Enviar una respuesta exitosa con el mensaje de éxito, el token y los datos del usuario
            return res.send({ message: 'User logged successfully', token, userLogged });
        }
        // En caso de credenciales inválidas, enviar una respuesta con un mensaje de error y código de estado 401 (No autorizado)
        return res.status(401).send({ message: 'Invalid credentials' });
    } catch (err) {
        // En caso de un error interno, registrar el error y enviar una respuesta con un mensaje de error y código de estado 500 (Error del servidor)
        console.error(err);
        return res.status(500).send({ message: 'Error, not logged' });
    }
}

exports.getClient = async (req, res) => {
    try {
        let client = await User.find({ role: 'CLIENT' }).sort({ balance: 1 });
        return res.send({ message: 'Client found', client });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error getting client' });
    }
}

exports.getClientss = async (req, res) => {
    try {
        let client = await User.find({ role: 'CLIENT' }).sort({ balance: -1 });
        return res.send({ message: 'Client found', client });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error getting client' });
    }
}


exports.getUsers = async (req, res) => {
    try {
        // Buscar usuarios en la base de datos que tengan el rol de 'CLIENT' o 'COLLABORATOR'.
        // El segundo argumento del método find es una proyección, donde podemos especificar qué campos se deben incluir/excluir de la respuesta.
        // En este caso, se excluye el campo 'password' para no revelar la contraseña de los usuarios en la respuesta.
        const users = await User.find({
            $or: [
                { role: 'CLIENT' },
                { role: 'COLLABORATOR' }
            ]
        }, { password: 0 });
        // Enviar una respuesta exitosa con el mensaje de éxito y la lista de usuarios encontrados
        return res.send({ message: 'Users found', users });
    } catch (err) {
        // En caso de un error interno, registrar el error y enviar una respuesta con un mensaje de error y código de estado 500 (Error del servidor)
        console.error(err);
        return res.status(500).send({ message: 'Error getting users' });
    }
}

exports.getCollaborator = async (req, res) => {
    try {
        // Buscar usuarios en la base de datos que tengan el rol de 'COLLABORATOR'.
        let collaborator = await User.find({ role: 'COLLABORATOR' });

        // Enviar una respuesta exitosa con el mensaje de éxito y la lista de usuarios colaboradores encontrados.
        return res.send({ message: 'Collaborators found', collaborator });
    } catch (err) {
        // En caso de un error interno, registrar el error y enviar una respuesta con un mensaje de error y código de estado 500 (Error del servidor).
        console.error(err);
        return res.status(500).send({ message: 'Error getting collaborators' });
    }
}

exports.getUser = async (req, res) => {
    try {
        // Obtener el ID del usuario de los parámetros de la solicitud
        let userId = req.params.id;
        // Buscar al usuario en la base de datos por su ID (_id)
        let user = await User.findOne({ _id: userId });
        // Verificar si se encontró un usuario con el ID proporcionado
        if (!user) return res.status(404).send({ message: 'User not found' });
        // Enviar una respuesta exitosa con el mensaje de éxito y los detalles del usuario encontrado.
        return res.send({ message: 'User found', user });
    } catch (err) {
        // En caso de un error interno, registrar el error y enviar una respuesta con un mensaje de error y código de estado 500 (Error del servidor).
        console.error(err);
        return res.status(500).send({ message: 'Error getting user' });
    }
}

exports.update = async (req, res) => {
    try {
        // Obtener el ID del usuario de los parámetros de la solicitud
        let userId = req.params.id;
        // Obtener los datos del cuerpo de la solicitud (los datos a actualizar)
        let data = req.body;
        // Verificar si se proporcionó el campo "dpi" o si no se envió ningún dato para actualizar
        if (data.dpi || Object.entries(data).length === 0) {
            return res.status(400).send({ message: 'Have submitted some data that cannot be updated' });
        }
        // Actualizar los datos del usuario en la base de datos utilizando el método findOneAndUpdate()
        // El tercer argumento { new: true } se utiliza para devolver el documento actualizado en lugar del original
        let accountUpdate = await User.findOneAndUpdate(
            { _id: userId },
            data,
            { new: true }
        );
        // Verificar si se encontró un usuario con el ID proporcionado y si se pudo actualizar correctamente
        if (!accountUpdate) {
            return res.status(404).send({ message: 'User not found and not updated' });
        }
        // Enviar una respuesta exitosa con el mensaje de éxito y los datos actualizados del usuario.
        return res.send({ message: 'Account updated', accountUpdate });
    } catch (err) {
        // En caso de un error interno, registrar el error y enviar una respuesta con un mensaje de error y código de estado 500 (Error del servidor).
        console.error(err);
        return res.status(500).send({ message: 'Error not updated account' });
    }
}



exports.deleteUser = async (req, res) => {
    try {
        // Obtener el ID del usuario de los parámetros de la solicitud
        const userId = req.params.id;
        // Eliminar al usuario de la base de datos por su ID utilizando el método findByIdAndDelete()
        const deletedUser = await User.findByIdAndDelete(userId);
        // Verificar si se encontró un usuario con el ID proporcionado y si se eliminó correctamente
        if (!deletedUser) {
            return res.status(404).send({ message: 'User not found' });
        }
        // Enviar una respuesta exitosa con el mensaje de éxito indicando que el usuario se eliminó correctamente.
        return res.send({ message: 'User deleted successfully' });
    } catch (error) {
        // En caso de un error interno, registrar el error y enviar una respuesta con un mensaje de error y código de estado 500 (Error del servidor).
        console.error(error);
        return res.status(500).send({ message: 'Could not delete user' });
    }
}
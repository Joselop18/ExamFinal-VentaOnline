import {hash, verify} from 'argon2';
import Usuario from '../users/user.model.js';
import { generarJWT } from '../helpers/generate-JWT.js';

export const login = async(req, res) => {
    
    const { email, password, username } = req.body;

    try {
        const user = await Usuario.findOne({
            $or: [
                {username}
            ]
        })
        if(req.body.email){
            return res.status(400).json({
                msg: 'Solo se puede iniciar sesion con el Nombre de usuario'
            })
        }
        if (!user) {
            return res.status(400).json({
                msg: 'Credenciales incorrectas, Este usuario no se encuentra en la base de datos'
            });
        }
        if (!user.state) {
            return res.status(400).json({
                msg: 'Este usuario no se encuentra en la base de datos'
            })
        }

        const validPassword = await verify(user.password, password);
        if(!validPassword){
            return res.status(400).json({
                msg: 'Credenciales incorrectas, contraseña incorrecta'
            })
        }

        const token = await generarJWT(user.id);

        res.status(200).json({
            msg: 'Se ha iniciado sesion correctamente',
            userDetails: {
                username: user.username,
                token: token,
                profilePicture: user.profilePicture
            }
        })

    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: "Server error",
            error: e.message
        })
    }
}

export const register = async(req, res) => {
    try {
        const data = req.body;
        const encryptedPassword = await hash(data.password);
        const user = await Usuario.create({
            name: data.name,
            surname: data.surname,
            username: data.username,
            email: data.email,
            phone: data.phone,
            password: encryptedPassword,
            role: data.role
        })

        return res.status(201).json({
            message: "Se registro el usuario correctamente",
            userDetails: {
                user: user.email
            }
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error al registrar el usuario",
            error: error.message
        })
    }
}
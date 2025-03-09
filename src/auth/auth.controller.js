import {hash, verify} from "argon2";
import Usuario from '../users/user.model.js';
import { generarJWT } from '../helpers/generate-jwt.js';

export const login = async (req, res) => {
    const {email, password, username} = req.body;
    try {
        const user = await Usuario.findOne({
            $or: [{email},{username}]
        })
        if(!user){
            return res.status(400).json({
                msg: "Este correo no existe en la base de datos"
            });
        }
        if(!user.estado){
            return res.status(400).json({
                msg: "Este usuario no se encuentra activo"
            }); 
        }

        const validPassword = await verify(user.password, password);
        if(!validPassword){
            return res.status(400).json({
                msg: "Esta contraseña es incorrecta"
            })
        }

        const token = await generarJWT(user.id);
        res.status(200).json({
            msg: "Se pudo iniciar sesión correctamente",
            userDetails: {
                username: user.username,
                token: token
            }
        })
    } catch (error) {
        console.log(e);
        res.status(500).json({
            msg: 'Server Error',
            error: e.message
        })
    }
}

export const register = async (req, res) => {
    try {
        const { name, surname, username, email, phone, password } = req.body; 
        const existingUser = await Usuario.findOne({
            $or: [{ email }, { username }]
        });
        if (existingUser) {
            return res.status(400).json({
                msg: "Este correo o nombre de usuario ya existe en la base de datos"
            });
        }

        const userRole = "CLIENT_ROLE"; 
        const encryptedPassword = await hash(password);
        const user = await Usuario.create({
            name,
            surname,
            username,
            email,
            phone,
            password: encryptedPassword,
            role: userRole 
        });

        return res.status(201).json({
            message: "El Usuario se ha registrado con éxito",
            userDetails: {
                user: user.email
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "No se pudo registrar el usuario",
            error: error.message
        });
    }
};
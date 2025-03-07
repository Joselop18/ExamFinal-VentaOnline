import jwt from 'jsonwebtoken';
import Usuario from '../users/user.model.js';

export const validarJWT = async(req, res, next) => {

    const token = req.header('x-token');
    if(!token){
        return res.status(401).json({
            msg: 'No existe token en la petición'
        })
    }

    try {
        const {uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        const usuario = await Usuario.findById(uid);
        if(!usuario){
            return res.status(401).json({
                msg: 'Este usuario no existe en la base de datos'
            })
        }
        if(!usuario.state) {
            return res.status(401).json({
                msg: 'Token invalido - usuario en estado: false'
            })
        }

        req.usuario = usuario;
        next();

    } catch (e) {
        console.log(e);
        res.status(401).json({
            msg: 'Token invalido'
        })
    }
}
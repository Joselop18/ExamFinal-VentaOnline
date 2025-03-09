import { response, request } from "express";
import { hash } from "argon2";
import User from "./user.model.js";

export const getUsers = async (req = request, res = response) => {
    try {
        const { limite = 10, desde = 0 } = req.query;
        if (req.usuario.role === "CLIENT_ROLE") {
            const userId = req.usuario._id;
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "No se pudo encontrar el Usuario"
                });
            }
            return res.status(200).json({
                success: true,
                total: 1,
                users: [user] 
            });
        } 
        const query = { estado: true };
        const [total, users] = await Promise.all([
            User.countDocuments(query),
            User.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
        ]);
        res.status(200).json({
            success: true,
            total,
            users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "No se pudo obtener el usuario",
            error
        });
    }
};

export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        if (req.usuario.role === "CLIENT_ROLE") {
            const userId = req.usuario._id.toString(); 

            if (userId !== id) {
                return res.status(403).json({
                    success: false,
                    msg: "No puedes ver este usuario por que no es el tuyo"
                });
            }
        }
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                msg: "No se encontro este usuario"
            });
        }
        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "No se pudo obtener el usuario",
            error
        });
    }
};

export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { role, password, ...rest } = req.body;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Este usuario no no se encuentra en la base de datos"
            });
        }
        if (req.usuario.role !== "ADMIN_ROLE" && req.usuario._id.toString() !== id) {
            return res.status(403).json({
                success: false,
                message: "No puedes editar este usuario, no tienes los permisos correspondientes"
            });
        }
        if (req.usuario.role !== "ADMIN_ROLE" && role) {
            return res.status(403).json({
                success: false,
                message: "No puedes cambiar de rol, no tienes los permisos necesarios"
            });
        }
        if (role && role === "ADMIN_ROLE" && req.usuario.role !== "ADMIN_ROLE") {
            return res.status(403).json({
                success: false,
                message: "Solo los administradores pueden asignar el rol de administrador"
            });
        }
        if (password) {
            const hashedPassword = await hash(password);
            rest.password = hashedPassword;
        }
        const updatedUser = await User.findByIdAndUpdate(id, { ...rest, role }, { new: true });
        res.status(200).json({
            success: true,
            message: "Se actualizo el usuario correctamente",
            updatedUser
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "No se pudo actualizar el usuario",
            error
        });
    }
};

export const closeUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.usuario._id, { estado: false }, { new: true });
        if (!user) {
            return res.status(404).json({
                success: false,
                msg: "Este usuario no se pudo encontrar"
            });
        }
        res.status(200).json({
            success: true,
            msg: "Se cerro la sesión correctamente",
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Hubo un problema a la hora de cerrar la sesión",
            error
        });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndUpdate(id, { estado: false }, { new: true });

        res.status(200).json({
            success: true,
            msg: "Usuario desactivado",
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error al desactivar el usuario",
            error
        });
    }
};
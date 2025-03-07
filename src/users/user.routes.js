import { Router } from "express";
import { check } from "express-validator";
import { getUsers, deleteUser, updateUser } from './user.controller.js'
import { deleteRestricted, RestrictedUser, confirmDeleteUser } from '../middlewares/validar-usuario.js';
import { validarJWT } from '../middlewares/validar-jwt.js';
import { validarCampos } from "../middlewares/validar-campos.js";

const router = Router();

router.get("/", getUsers)

router.delete(
    '/:id',
    [
        validarJWT,
        deleteRestricted,
        confirmDeleteUser,
        validarCampos
    ],
    deleteUser
)

router.put(
    '/:id',
    [
        validarJWT,
        RestrictedUser,
        validarCampos
    ],
    updateUser
)

export default router;
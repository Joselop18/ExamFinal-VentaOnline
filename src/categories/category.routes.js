import { Router } from 'express';
import { saveCategories, getCategories, deleteCategory, updateCategory } from './category.controller.js';
import { onlyAdminCategoria } from '../middlewares/validar-categoria.js'
import { validarCampos } from '../middlewares/validar-campos.js';
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();

router.post(
    '/submit',
    [
        validarJWT,
        onlyAdminCategoria,
        validarCampos
    ],
    saveCategories
)

router.get('/', getCategories)

router.delete(
    '/:id',
    [
        validarJWT,
        onlyAdminCategoria,
        validarCampos,
    ],
    deleteCategory
)

router.put(
    '/:id',
    [
        validarJWT,
        onlyAdminCategoria,
        validarCampos
    ],
    updateCategory
)

export default router;
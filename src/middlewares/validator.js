import { body } from 'express-validator'
import { validarCampos } from './validar-campos.js'
import { existenteEmail,  esRolValido} from '../helpers/db-validator.js'

export const registerValidator = [
    body('name', 'El nombre es obligatorio').not().isEmpty(),
    body('surname', 'El apellido es obligatorio').not().isEmpty(),
    body('email', 'Ingrese un email valido').isEmail(),
    body('email').custom(existenteEmail),
    body('role').custom(esRolValido),
    body('password', "Ingrese una contraseña de minimo 7 caracteres").isLength({min: 7}),
    validarCampos
];

export const loginValidator = [
    body("email").optional().isEmail().withMessage("Ingrese una dirección de correo electrónico válida"),
    body("username").optional().isEmail().isString().withMessage("Ingrese un nombre de usuario válido"),
    body("password", "Ingrese una contraseña de minimo 7 caracteres").isLength({min: 7}),
    validarCampos
]
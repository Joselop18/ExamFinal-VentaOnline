import { Router } from "express";
import { check } from "express-validator";
import { createBill, getUserBills, getBillById, cancelBill, updateBill, markBillAsPaid, checkout } from "./invoice.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { validarRol } from "../middlewares/validar-roles.js";

const router = Router();

router.post(
    "/",
    [
        validarJWT,
        check("cartId", "Es obligatorio el Id del carrito").not().isEmpty(),
        check("cartId", "Este ID es invalido").isMongoId(),
        check("shippingAddress", "La dirección de envío es obligatoria").not().isEmpty(),
        validarCampos
    ],
    createBill
);

router.get("/", 
    [
        validarJWT,
    ],
    getUserBills);

router.get(
    "/:id",
    [
        validarJWT,
        check("id", "Este ID es invalido").isMongoId(),
        validarCampos
    ],
    getBillById
);

router.put(
    "/cancelado/:id",
    [
        validarJWT,
        validarRol("ADMIN_ROLE"),
        check("id", "Este ID es invalido").isMongoId(),
        validarCampos
    ],
    cancelBill
);

router.put(
    "/:id",
    [
        validarJWT,
        validarRol("ADMIN_ROLE"),
        check("id", "Este ID es invalido").isMongoId(),
        validarCampos
    ],
    updateBill
);

router.put(
    "/pagado/:id", 
    [
        validarJWT,  
        validarRol("ADMIN_ROLE"), 
        check("id", "Este ID es invalido").isMongoId(), 
        validarCampos 
    ], 
    markBillAsPaid
);

router.post(
    "/checkout",
    [
        validarJWT,
        validarRol("CLIENT_ROLE"),
    ],
    checkout
);


export default router;
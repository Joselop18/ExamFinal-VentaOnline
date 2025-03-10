import { Router } from "express";
import { check } from "express-validator";
import { getCart, addToCart, removeFromCart, clearCart } from "./salescart.controller.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { validarCampos } from "../middlewares/validar-campos.js";

const router = Router();

router.get("/", 
    [
    validarJWT
    ],
    getCart
);

router.post(
    "/add",
    [
        validarJWT,
        check("products")
        .custom((value, { req }) => {
            if (!Array.isArray(value) && (!req.body.productId || !req.body.quantity)) {
                throw new Error("Tiene que enviar el producto y la cantidad");
            }
                return true;
            }),
        check("products.*.productId", "Producto debe ser obligatorio").optional().isMongoId(),
        check("products.*.quantity", "Tiene que ser mayor a 0 la cantidad").optional().isInt({ min: 1 }),
        check("productId", "ID del producto obligatorio").optional().isMongoId(),
        check("quantity", "Tiene que ser mayor a 0 la cantidad").optional().isInt({ min: 1 }),
        validarCampos
    ],
    addToCart
);


router.delete(
    "/remove/:productId",
    [
        validarJWT,
        check("productId", "El ID del producto obligatorio").isMongoId(),
        validarCampos
    ],
    removeFromCart
);

router.delete("/clear", validarJWT, clearCart);

export default router;
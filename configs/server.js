'use strict'

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { dbConnection } from './mongo.js';
import { initializeCategories } from "../src/categories/category.controller.js"
import { crearAdmin } from "../src/users/user.controller.js"
import limiter from '../src/middlewares/validar-cant-peticiones.js'
import authRoutes from '../src/auth/auth.routes.js'
import userRoutes from "../src/users/user.routes.js"
import categoryRoutes from "../src/categories/category.routes.js"
import productRoutes from "../src/products/product.routes.js"
import cartRoutes from "../src/salescart/salescart.routes.js"
import invoiceRoutes from "../src/invoices/invoice.routes.js"

const configurarMiddlewares = (app) => {
    app.use(express.urlencoded({extended: false}));
    app.use(cors());
    app.use(express.json());
    app.use(helmet());
    app.use(morgan('dev'));
    app.use(limiter);
}

const configurarRutas = (app) =>{
        app.use("/onlineVentas/v1/auth", authRoutes);
        app.use("/onlineVentas/v1/usuarios", userRoutes);
        app.use("/onlineVentas/v1/categorias", categoryRoutes);
        app.use("/onlineVentas/v1/productos", productRoutes);
        app.use("/onlineVentas/v1/carrito", cartRoutes);
        app.use("/onlineVentas/v1/facturas", invoiceRoutes);
}

const conectarDB = async () => {
    try {
        await dbConnection();
        console.log("Conexion exitosa a la Base de Datos");
        await initializeCategories();
    } catch (error) {
        console.log("Error al conectar a la Base de Datos", error);
    }
}

export const iniciarServidor = async () => {
    const app = express();
    const port = process.env.PORT || 3000;

    await conectarDB();
    await crearAdmin();
    configurarMiddlewares(app);
    configurarRutas(app);

    app.listen(port, () => {
        console.log(`Server Running On Port ${port}`);
    });
}
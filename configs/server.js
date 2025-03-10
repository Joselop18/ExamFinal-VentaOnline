'use strict'

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { dbConnection } from './mongo.js';
import { hash } from "argon2"
import Category from "../src/categories/category.model.js"
import Usuario from "../src/users/user.model.js"
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

const crearAdmin = async () => {
    try {
        const adminExistente = await Usuario.findOne({ email: "admin@gmail.com" });
        if (!adminExistente) {
            const passwordEncriptada = await hash("Admin002");
            const admin = new Usuario({
                name: "Admin",
                surname: "Dueño",
                username: "El Jefe",
                email: "admin@gmail.com",
                phone: "45679874",
                password: passwordEncriptada,
                role: "ADMIN_ROLE"
            });
            await admin.save(); 
            console.log("Se creo el administrador correctamente");
        } else {
            console.log("Este administrador ya existe");
        }
    } catch (error) {
        console.error("No se pudo crear al administrador: ", error);
    }
};

const initializeCategories = async () => {
    try {
        const defaultCategory = await Category.findOne({ name: "General" });
        if (!defaultCategory) {
            await Category.create({ name: "General" });
            console.log("Categoría por defecto creada: General");
        } else {
            console.log("Categoría por defecto ya existente");
        }
    } catch (error) {
        console.error("Error al inicializar categorías:", error);
    }
};

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
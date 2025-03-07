'use strict'

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { dbConnection } from './mongo.js';
import limiter from '../src/middlewares/validar-cant-peticiones.js';
import authRoutes from '../src/auth/auth.routes.js';
import userRoutes from '../src/users/user.routes.js';
//import categoriaRoutes from '../src/categorias/categorias-routes.js';
//import { defaultCategoria } from '../src/middlewares/validar-categorias.js'

const middlewares = (app) => {
    app.use(express.urlencoded({ extended: false}));
    app.use(express.json());
    app.use(cors());
    app.use(helmet());
    app.use(morgan('dev'));
    app.use(limiter);
}
const routes = (app) => {
    app.use('/ventaOnline/v1/auth', authRoutes),
    app.use('/ventaOnline/v1/users', userRoutes)
    //app.use('/ventaOnline/v1/categorias', categoriaRoutes)
}

const conectarDB = async() => {
    try{
        await dbConnection();
        console.log('Conexion exitosa con la base de datos');
    }catch (error) {
        console.log('Error al conectar con la base de datos', error);
    }

}

export const iniciarServidor = async() => {
    const app = express();
    const port = process.env.PORT || 3010;

    try {
        middlewares(app);
        conectarDB();
        routes(app);
        //defaultCategoria();
    } catch (err) {
        console.log(`Server init failed: ${err}`)
    }

    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}
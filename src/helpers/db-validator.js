import Role from '../role/role.model.js';
import Usuario from '../users/user.model.js';

export const esRolValido = async(role = '') => {
    const existeRol = await Role.findOne({role});

    if(!existeRol){
        throw new Error(`El rol ${role} no existe en la base de datos`)
    }
}

export const existenteEmail = async (correo = '') => {
    const existeEmail = await Usuario.findOne({correo});

    if(existeEmail){
        throw new Error(`El correo ${correo} ya existe en la base de datos`)
    }
}

export const existeUsuarioById = async (id = '') => {
    const existeUsuario = await Usuario.findById(id);

    if(!existeUsuario){
        throw new Error(`El usuario con el id ${id} no existe en la base de datos`)
    }
}
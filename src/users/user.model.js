import {Schema, model} from "mongoose";

const UserSchema = Schema({
    name: {
        type: String,
        required: [true, 'Nombre Obligatorio']
    },
    surname: {
        type: String,
        required: [true, 'Apellido obligatorio'],
    },
    username: {
        type: String,
        required: [true, 'Nombre de usuario obligatorio'],
    },
    email: {
        type: String,
        required: [true, 'Email obligatorio'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Contraseña obligatoria']
    },
    phone: {
        type: String,
        minLenght: 8,
        maxLenght: 8,
        required: [true, 'El numero de telefono es obligatorio']
    },
    role: {
        type: String,
        required: true,
        enum: ['ADMIN_ROLE', 'CLIENT_ROLE'],
        default: 'CLIENT_ROLE'
    },
    estado: {
        type: Boolean,
        default: true
    }
}, {
    timeStamps: true,
    versionKey: false
});

UserSchema.methods.toJSON = function(){
    const { __v, password, _id, ...usuario} = this.toObject();
    usuario.uid = _id;
    return usuario;
}

export default model ('Usuario', UserSchema);
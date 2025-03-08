import {Schema, model} from "mongoose";

const UserSchema = Schema({
    name: {
        type: String,
        required: [true, 'Nombre Obligatorio']
    },
    surname: {
        type: String,
        required: [true, 'Apellido obligatorio'],
        unique: true
    },
    username: {
        type: String,
        required: [true, 'Nombre de usuario obligatorio'],
        unique: true
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
        maxLenght: 8
    },
    role: {
        type: String,
        required: true,
        enum: ['ADMIN_ROLE', 'CLIENT_ROLE'],
        default: 'CLIENT_ROLE'
    },
    state: {
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
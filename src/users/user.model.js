import {Schema, model} from "mongoose";

const UserSchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        maxLenght: [25, 'No puede sobrepasar los 25 caracteres']
    },
    surname: {
        type: String,
        required: [true, 'El apellido es obligatorio'],
        unique: true
    },
    username: {
        type: String,
        required: [true, "Nombre de usuario es obligatorio"],
        unique: true,
    },
    email: {
        type: String,
        required: [true, 'El email es obligatorio'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    phone: {
        type: String,
        minLenght: 8,
        maxLenght: 8
    },
    role: {
        type: String,
        required: true,
        enum: ['ADMIN_ROLE', 'CLIENT_ROLE']
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

export default model ('User', UserSchema);
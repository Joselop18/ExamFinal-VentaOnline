import {Schema, model} from 'mongoose'

const CategorySchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true,
        maxLenght: 45
    },
    descripcion: {
        type: String,
        maxLenght: 350
    },
    state: {
        type: Boolean,
        default: true
    }
})

export default model('Categoria', CategorySchema)
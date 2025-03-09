import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Nombre de Producto Obligatorio"]
    },
    description: {
        type: String,
        required: [true, "Descripcion de Producto Obligatorio"]
    },
    price: {
        type: Number,
        required: [true, "Prcio de Producto Obligatorio"],
        min: [0, "Precio no debe ser menor a 0"]
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    stock: {
        type: Number,
        required: [true, "Stock de Producto Obligatorio"],
        min: [0, "Stock de Producto no debe ser negativo"]
    },
    status: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    versionKey: false
});

export default mongoose.model("Producto", ProductSchema);

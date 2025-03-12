import mongoose from "mongoose";

const CartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
        required: true,
        unique: true
    },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Producto",
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1
            },
            price: {
                type: Number,
                required: true
            }
        }
    ],
    totalPrice: {
        type: Number,
        default: 0
    }
});

CartSchema.methods.toJSON = function () {
    const { __v, ...cart } = this.toObject();
    return cart;
};

export default mongoose.model("Carrito", CartSchema);

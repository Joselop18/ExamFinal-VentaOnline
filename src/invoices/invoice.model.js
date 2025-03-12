import mongoose from "mongoose";

const InvoiceSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario", 
        required: true
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
                required: false
            }
        }
    ],
    total: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["pendiente", "pagado", "cancelado"],
        default: "pendiente"
    },
    shippingAddress: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

InvoiceSchema.methods.toJSON = function() {
    const { __v, ...invoice } = this.toObject();
    return invoice;
};

export default mongoose.model("Factura", InvoiceSchema);
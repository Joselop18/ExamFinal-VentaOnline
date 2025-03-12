import Cart from "./salescart.model.js";
import Product from "../products/product.model.js";

export const getCart = async (req, res) => {
    try {
        let carts;
        if (req.usuario.role === "ADMIN_ROLE") {
            carts = await Cart.find().populate("products.product", "name price");
        } else {
            carts = await Cart.findOne({ user: req.usuario._id }).populate("products.product", "name price");
        }
        if (!carts) {
            return res.status(404).json({
                success: false,
                message: "No se ha encontrado el carrito"
            });
        }
        res.status(200).json({
            success: true,
            carts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "No se pudo obtener el carrito",
            error
        });
    }
};

export const addToCart = async (req, res) => {
    const { products } = req.body;
    if (!Array.isArray(products) || products.length === 0) {
        return res.status(400).json({
            success: false,
            message: "Se tiene que agregar un producto como mínimo"
        });
    }
    try {
        let cart = await Cart.findOne({ user: req.usuario._id });
        if (!cart) {
            cart = new Cart({ user: req.usuario._id, products: [], totalPrice: 0 });
        }
        let totalPrice = cart.totalPrice || 0;

        for (const { productId, quantity } of products) {
            const product = await Product.findById(productId);
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: `El producto con Id ${productId} no se ha encontrado`
                });
            }
            if (product.stock < quantity) {
                return res.status(400).json({
                    success: false,
                    message: `El producto tiene un stock insuficiente: ${product.name}`
                });
            }

            const productIndex = cart.products.findIndex(p => p.product.equals(productId));

            if (productIndex > -1) {
                const currentQuantity = cart.products[productIndex].quantity;
                const newQuantity = currentQuantity + quantity;
                if (newQuantity > product.stock) {
                    return res.status(400).json({
                        success: false,
                        message: `Imposible agregar más productos: ${product.name}`
                    });
                }
                cart.products[productIndex].quantity = newQuantity;
            } else {
                cart.products.push({ 
                    product: productId, 
                    quantity, 
                    price: product.price
                });
            }
            product.stock -= quantity;
            totalPrice += product.price * quantity;
            await product.save();
        }

        cart.totalPrice = totalPrice;
        await cart.save();

        res.status(200).json({
            success: true,
            message: "Se agregaron productos al carrito",
            cart
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "No se pudo agregar productos al carrito",
            error
        });
    }
};

export const removeFromCart = async (req, res) => {
    const { productId } = req.params;
    try {
        const cart = await Cart.findOne({ user: req.usuario._id });
        if (!cart) {
            return res.status(404).json({ 
                success: false, 
                message: "No se ha encontrado el carrito" 
            });
        }

        const productIndex = cart.products.findIndex(p => p.product.equals(productId));
        if (productIndex > -1) {
            const product = await Product.findById(productId);
            if (product) {
                product.stock += cart.products[productIndex].quantity;
                await product.save();
            }
            cart.products.splice(productIndex, 1);
            await cart.save();
        }

        res.status(200).json({ 
            success: true, 
            message: "Se ha elminado el producto del carrito", 
            cart 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "No se pudo eliminar el producto del carrito", 
            error 
        });
    }
};

export const clearCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.usuario._id }).populate("products.product");
        if(!cart){
            return res.status(404).json({
                success: false,
                message: "No se ha encontrado el carrito"
            });
        }
        for (const item of cart.products) {
            const product = item.product;
            if(product){
                product.stock += item.quantity;
                await product.save();
            }
        }
        await Cart.findOneAndDelete({ user: req.usuario._id });
        res.status(200).json({
            success: true,
            message: "El carrito se ha vaciado correctamente"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "No se pudo vaciar el carrito",
            error
        });
    }
}
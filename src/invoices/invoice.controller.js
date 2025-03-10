import Bill from "./invoice.model.js";
import Product from "../products/product.model.js";
import Cart from "../salescart/salescart.model.js"

export const createBill = async (req, res) => {
    const { cartId, shippingAddress } = req.body;
    if (!shippingAddress || shippingAddress.trim() === "") {
        return res.status(400).json({
            success: false,
            message: "La direccion de envio es obligatorio"
        });
    }
    try {
        const cart = await Cart.findOne({ _id: cartId, user: req.usuario._id }).populate("products.product");
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "No pertenece al usuario o no existe el carrito"
            });
        }
        if (cart.products.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No puedes comprar sin productos en el carrito"
            });
        }
        let total = 0;

        const purchasedProducts = cart.products.map(item => {
            total += item.product.price * item.quantity;
            return {
                product: item.product._id,
                quantity: item.quantity,
                priceAtPurchase: item.product.price
            };
        });
        const newBill = new Bill({
            user: req.usuario._id,
            products: purchasedProducts,
            shippingAddress,
            total,
            status: "pendiente"
        });

        await newBill.save();
        cart.products = []; 
        await cart.save();

        res.status(201).json({
            success: true,
            message: "Se creo la factura correctamente",
            bill: newBill
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "No se pudo crear la factura",
            error
        });
    }
};

export const getUserBills = async (req, res) => {
    try {
        let bills;
        if (req.usuario.role === "ADMIN_ROLE") {
            bills = await Bill.find()
                .populate("products.product", "name price")
                .populate("user", "name surname email")
                .exec();
        } else {
            bills = await Bill.find({ user: req.usuario._id })
                .populate("products.product", "name price")
                .populate("user", "name surname email")
                .exec();
        }

        res.status(200).json({ 
            success: true, 
            bills 
        });
    } catch (error) {
        res.status(500).json({ success: false, 
            message: "No se pudo obtener la factura", 
            error 
        });
    }
};

export const getBillById = async (req, res) => {
    const { id } = req.params;
    try {
        const bill = await Bill.findById(id)
            .populate("products.product", "name price")
            .populate("user", "name surname email")
            .exec();

        if (!bill) {
            return res.status(404).json({ 
                success: false, 
                message: "No se encontro la factura" 
            });
        }

        if (req.usuario.role === "CLIENT_ROLE" && bill.user._id.toString() !== req.usuario._id.toString()) {
            return res.status(403).json({ 
                success: false, 
                message: "No permites con los permisos necesarios para ver la factura" 
            });
        }

        res.status(200).json({ 
            success: true, 
            bill 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "No se pudo obtener la factura", 
            error 
        });
    }
};

export const cancelBill = async (req, res) => {
    const { id } = req.params;
    try {
        const bill = await Bill.findById(id);

        if (!bill) {
            return res.status(404).json({ 
                success: false, 
                message: "No se encontro la factura" 
            });
        }

        if (bill.status !== "pendiente") {
            return res.status(400).json({ 
                success: false, 
                message: "Se tiene permitido cancelar las facturas pendientes" 
            });
        }

        if (req.usuario.role === "CLIENT_ROLE" && bill.user.toString() !== req.usuario._id.toString()) {
            return res.status(403).json({ 
                success: false, 
                message: "No permites con los permisos necesarios para cancelar la factura" 
            });
        }

        bill.status = "cancelar";

        for (let i = 0; i < bill.products.length; i++) {
            await Product.findByIdAndUpdate(bill.products[i].product, { $inc: { stock: bill.products[i].quantity } });
        }
        await bill.save();

        res.status(200).json({
            success: true,
            message: "Se cancelo la factura correctamente", 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: "No se pudo cancelar la factura", 
            error
        });
    }
};

export const updateBill = async (req, res) => {
    const { id } = req.params;
    const { products, shippingAddress } = req.body;
    try {
        const bill = await Bill.findById(id);

        if (!bill) {
            return res.status(404).json({
                success: false,
                message: "No se encontro la factura"
            });
        }

        if (bill.status !== "pendiente") {
            return res.status(400).json({
                success: false,
                message: "Las facturas pendientes son las unicas que se pueden editar"
            });
        }

        for (let i = 0; i < bill.products.length; i++) {
            await Product.findByIdAndUpdate(bill.products[i].product, {
                $inc: { stock: bill.products[i].quantity }
            });
        }

        let total = 0;
        let updatedProducts = [];

        for (let i = 0; i < products.length; i++) {
            const product = await Product.findById(products[i].product);

            if (!product || product.stock < products[i].quantity) {
                return res.status(400).json({
                    success: false,
                    message: `No se encontro el producto: ${products[i].product}`
                });
            }

            total += product.price * products[i].quantity;

            await Product.findByIdAndUpdate(products[i].product, {
                $inc: { stock: -products[i].quantity }
            });

            updatedProducts.push({
                product: products[i].product,
                quantity: products[i].quantity,
                priceAtPurchase: product.price 
            });
        }

        bill.products = updatedProducts;
        bill.shippingAddress = shippingAddress;
        bill.total = total;
        await bill.save();

        res.status(200).json({
            success: true,
            message: "Se actualizo la factura correctamente",
            bill
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "No se pudo editar la factura",
            error
        });
    }
};

export const markBillAsPaid = async (req, res) => {
    const { id } = req.params;
    try {
        const bill = await Bill.findById(id);
        if (!bill) {
            return res.status(404).json({
                success: false, 
                message: "No se encontro la factura" 
            });
        }

        if (bill.status === "pagado") {
            return res.status(400).json({ 
                success: false, 
                message: "Esta factura ya fue pagado con exito" 
            });
        }

        if (bill.status === "cancelado") {
            return res.status(400).json({ 
                success: false, 
                message: "Es imposible pagar una factura cancelado" 
            });
        }

        bill.status = "pagado";

        await bill.save();

        res.status(200).json({ 
            success: true, 
            message: "Esta factura se marco pagado con exito", 
            bill 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "No se pudo actualizar la factura", 
            error: error.message 
        });
    }
};

export const checkout = async (req, res) => {
    try {
        const userId = req.usuario._id;
        const cart = await Cart.findOne({ user: userId }).populate("products.product");

        if (!cart || cart.products.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Tienes que tener productos en el carrito para poder comprar"
            });
        }

        let total = 0;
        const productsToBuy = req.body.products; 

        for (let item of productsToBuy) {
            const productInCart = cart.products.find(p => p.product._id.toString() === item.product);

            if (!productInCart) {
                return res.status(400).json({
                    success: false,
                    message: `Este producto ${item.product} no se encuentra en tu carrito de compra. Tienes que Agregar primero al carrito`
                });
            }

            if (productInCart.quantity < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `El Stock es insuficiente en el carrito para el producto ${item.product}.`
                });
            }
            total += productInCart.product.price * item.quantity;
        }

        const bill = new Bill({
            user: userId,
            products: productsToBuy.map(item => ({
                product: item.product,
                quantity: item.quantity,
                priceAtPurchase: cart.products.find(p => p.product._id.toString() === item.product).product.price
            })),
            total
        });

        await bill.save();

        cart.products = cart.products.filter(p => 
            !productsToBuy.some(item => item.product === p.product._id.toString())
        );
        await cart.save();

        return res.status(201).json({
            success: true,
            message: "Se realizo la compra con exito",
            bill
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "No se pudo realizar la compra",
            error
        });
    }
};
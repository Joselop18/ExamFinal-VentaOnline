import Product from "../products/product.model.js";
import Category from "../categories/category.model.js";
import User from "../users/user.model.js";

export const saveProduct = async (req, res) => {
    try {
        const { name, description, price, category, stock } = req.body;
        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
            return res.status(400).json({
                success: false,
                message: "Esta categoría no existe"
            });
        }
        const product = new Product({
            name,
            description,
            price,
            category,
            stock,
            status: true
        });
        await product.save();
        res.status(200).json({
            success: true,
            message: "Se creo el producto exitosamente",
            product
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "No se pudo crear el producto",
            error
        });
    }
};

export const getProducts = async (req, res) => {
    const { limite = 10, desde = 0, sort = "name", order = "asc", category = "", name = "" } = req.query;
    const query = { status: true };
    if (category) {
        query.category = category;
    }
    if (name) {
        query.name = { $regex: name, $options: 'i' };  
    }
    const sortBy = order === "asc" ? 1 : -1;
    try {
        const products = await Product.find(query)
            .populate("category", "name") 
            .skip(Number(desde))  
            .limit(Number(limite))  
            .sort({ [sort]: sortBy });  

        const total = await Product.countDocuments(query);
        res.status(200).json({
            success: true,
            total,
            products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "No se pudo obtner los productos",
            error
        });
    }
};

export const searchProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findById(id)
            .populate("category", "name");
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "No se encontro ningun producto"
            });
        }
        res.status(200).json({
            success: true,
            product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "No se pudo buscar un producto",
            error
        });
    }
};

export const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "No se pudo encontrar el producto"
            });
        }

        if (req.usuario.role === "CLIENT_ROLE") {
            return res.status(403).json({ 
                success: false, 
                message: "No tienes permiso para eliminar producto" 
            });
        }

        product.status = false;
        await product.save();

        res.status(200).json({
            success: true,
            message: "Este producto ha sido eliminado exitosamente"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "No se pudo eliminar el producto",
            error
        });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { category, ...data } = req.body;

        if (!req.usuario) {
            return res.status(401).json({
                success: false,
                message: "La autenticacion del usuario no se logro con exito"
            });
        }
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "No se pudo encontrar el producto"
            });
        }
        if (category) {
            const categoryExists = await Category.findById(category);
            if (!categoryExists) {
                return res.status(400).json({
                    success: false,
                    message: "Categoría no válida"
                });
            }
            product.category = category;
        }
        Object.assign(product, data);
        await product.save();
        res.status(200).json({
            success: true,
            message: "Se actualizo el producto exitosamente",
            product
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "El producto no se pudo actualizar correctamente",
            error
        });
    }
};

export const getOutOfStockProducts = async (req, res) => {
    try {
        const products = await Product.find({ stock: 0, status: true }).populate("category", "name");
        res.status(200).json({
            success: true,
            products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "No se pudieron obtener los productos sin stock",
            error
        });
    }
};

export const getBestSellingProducts = async (req, res) => {
    try {
        const products = await Product.find({ status: true })
            .sort({ sales: -1 })
            .limit(10)
            .populate("category", "name");

        res.status(200).json({
            success: true,
            products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "No se pudieron obtener los productos mas vendidos",
            error
        });
    }
};
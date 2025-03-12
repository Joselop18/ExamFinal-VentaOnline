import Category from "../categories/category.model.js"
import Product from "../products/product.model.js"

export const initializeCategories = async () => {
    try {
        const defaultCategory = await Category.findOne({ name: "General" });
        if (!defaultCategory) {
            await Category.create({ name: "General" });
            console.log("Categoría por defecto creada: General");
        } else {
            console.log("Categoría por defecto ya existente");
        }
    } catch (error) {
        console.error("Error al inicializar categorías:", error);
    }
};

export const createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const category = new Category({ name });
        await category.save();

        res.status(201).json({
            success: true,
            message: "Se creo la categoria correctamente",
            category
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "No se pudo crear la categoria",
            error
        });
    }
};

export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({ status: true });
        res.status(200).json({
            success: true,
            categories
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "No se pudo obtener las categorías",
            error
        });
    }
};

export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const category = await Category.findByIdAndUpdate(id, { name }, { new: true });
        res.status(200).json({
            success: true,
            message: "Se actualizo la categoria correctamente",
            category
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "No se pudo actualizar la categoria",
            error
        });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const defaultCategory = await Category.findOne({ name: "General" });
        if (!defaultCategory) {
            return res.status(500).json({
                success: false,
                message: "La categoría por defecto no se pudo encontrar"
            });
        }
        await Product.updateMany({ category: id }, { category: defaultCategory._id });
        await Category.findByIdAndUpdate(id, { status: false });
        res.status(200).json({
            success: true,
            message: "La categoria se pudo eliminar correctamente"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "No se pudo eliminar la categoria",
            error: error.message 
        });
    }
};
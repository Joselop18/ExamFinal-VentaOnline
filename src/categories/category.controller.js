import Category from "./category.model.js";

export const saveCategories = async(req, res) => {
    try {
        const data = req.body;
        const category = new Category({
            nombre: data.nombre,
            descripcion: data.descripcion
        });

        await category.save();

        res.status(200).json({
            success: true,
            msg: "Se pudo agregar la categoria con exito",
            category
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "No se pudo agregar la categoria",
            error: error.message || error
        })
    }
}

export const getCategories = async(req, res) => {
    const query = { state: true }
    try {
        const [total, category] = await Promise.all([
            Category.countDocuments(query),
            Category.find(query)
        ]);

        return res.status(200).json({
            success: true,
            msg: "Se pudo obtner las categorias con exito",
            total,
            category
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "No se pudo obtener las categorias",
            error: error.message || error
        })
    }
}

export const deleteCategory = async(req, res) => {
    try {
        const { id } = req.params;
        const categoryDefecto = await Category.findOne({ nombre: "Casa"})
        await Producto.updateMany(
            { category: id },
            { category: categoryDefecto._id }
        )

        const category = await Category.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            msg: "Se elimino la categoria con exito",
            category
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "No se pudo eliminar la categoria",
            error: error.message || error
        })
    }
}

export const updateCategory = async(req, res) => {
    try {
        const { id } = req.params;
        const { _id, ...data } = req.body;
        const updateCategory = await Category.findByIdAndUpdate(id, data, {new: true});
        res.status(200).json({
            success: true,
            msg: "Se pudo actualizar la categoria con exito",
            category: updateCategory
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "No se pudo actualizar la categoria",
            error: error.message || error
        })
    }
}
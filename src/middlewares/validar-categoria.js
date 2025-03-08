import Categoria from "../categories/category.model.js";
import User from "../users/user.model.js";

export const defaultCategory = async() => {
    try {
        const categoriaExists = await Categoria.findOne({ nombre: "Cocina"});

        if(!categoriaExists){
            const categoria = new Categoria({
                nombre: "Cocina",
                descripcion: "Productos para la cocina"            
            })
            
            await categoria.save();
            console.log("Se creo la categoria correctamente");
        }else{
            console.log("Esta Categoria cocina ya existe");
        }
    } catch (error) {
        console.log("No se pudo crear la categoria")
    }
}

export const notDeleteDCategory = async() => {
    try {
        const categoria = await Categoria.findOne({ nombre: "Cocina" });
        if(categoria){
            await Categoria.findByIdAndUpdate(categoria._id, { state: false });
            console.log("La categoria Cosina se elimino correctamente"); 
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "No se pudo eliminar la categoria",
            error: error.message || error
        })
    }
}

export const onlyAdminCategoria = async(req, res, next) => {
    const authenticatedUser = req.user.role;
    try {
        if(authenticatedUser !== "ADMIN_ROLE"){
            return res.status(403).json({
                success: false,
                msg: "Usted no tiene permisos necesarios para eliminar una categoria"
            })
        }

        next();

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "No se pudo validar la categoria",
            error: error.message || error
        })
    }
}
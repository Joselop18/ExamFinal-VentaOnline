import user from "../users/user.model.js";

export const deleteRestricted = async(req, res, next) => {
    const { id } = req.params;
    const user = req.user.role;
    const authenticatedUser = req.user.id;

    try {  
        if(user !== "ADMIN_ROLE" && authenticatedUser !== id){
            return res.status(403).json({
                success: false,
                msg: "Usted no pude eliminar a otro usuario que no sea el suyo"
            })
        }

        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error al eliminar el usuario",
            error: error.message || error
        })
    }
}

export const RestrictedUser = async(req, res, next) => {
    const { id } = req.params;
    const user = req.user.role;
    const authenticatedUser = req.user.id;
    const { role } = req.body;

    try {
        if (role && user !== "ADMIN_ROLE") {
            return res.status(403).json({
                success: false,
                msg: "El Adim es el unico que puede editar el rol de un usuario"
            });
        }

        if(user !== "ADMIN_ROLE" && authenticatedUser !== id){
            return res.status(403).json({
                success: false,
                msg: "Edite su propio usuario"
            });

        }

        next();

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error al acutalizar la validacion",
            error: error.message || error
        })
    }
}

export const confirmDeleteUser = async(req, res, next) => {
    try {
        const { validacion } = req.body;

        if(validacion === "SI"){
            next();
        }else{
            return res.status(403).json({
                success: false,
                msg: "Confirme la eliminacion del usuario"
            })
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "No se pudo confirmar la eliminacion del usuario",
            error: error.message || error
        })
    }
}
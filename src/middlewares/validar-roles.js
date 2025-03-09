export const validarRol = (...roles) => {
    return (req, res, next) => {
        if (!req.usuario) {
            return res.status(500).json({
                success: false,
                msg: "Valide el token antes de verificar el rol"
            });
        }
        const { role, _id } = req.usuario;
        if (roles.includes(role)) {
            return next();
        }
        if (role === "CLIENT_ROLE") {
            if (req.params.id === _id.toString() || req.originalUrl.includes("/closeUser")) {
                return next(); 
            }
        }
        if (role === "ADMIN_ROLE") {
            if (req.params.id === _id.toString() || req.originalUrl.includes("/closeUser")) {
                return next(); 
            }
        }
        return res.status(403).json({
            success: false,
            msg: `Este usuario no esta permitido, tiene el rol de ${role}, los roles que si tienen acceso son ${roles.join(", ")}`
        });
    };
};
import User from './user.model.js'

export const getUsers = async(req, res) => {
    try {
        const { limite = 10, desde = 0 } = req.query;
        const query = { state: true };
        
        const [total, users] = await Promise.all([
            User.countDocuments(query),
            User.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
        ])

        res.status(200).json({
            success: true,
            total,
            users
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "No se pudo obtener los usuarios",
            error
        })
    }
}

export const deleteUser = async(req, res) => {
    const { id } = req.params;
    try {
    
        const user = await User.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            msg: "Se pudo eliminar el usuario con exito",
            user
        })
        
    } catch (error) {
        return res.status(500).json({
            success: true,
            msg: "No se pudo eliminar el usuario",
            error: error.message || error
        })
    }
}

export const updateUser = async(req, res) => {
    try {
        const { id } = req.params;
        const { _id, ...data} = req.body;
        const updateUser = await User.findByIdAndUpdate(id, data, {new: true});

        res.status(200).json({
            success: true,
            msg: "Se actualizo el usuario con exito",
            user: updateUser
        })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "No se pudo actualizar el usuario",
            error: error.message || error
        })
    }
}
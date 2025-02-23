import fs from 'fs/promises';
import {join} from 'path';

export const deleteFileOnError = async (err, req, res, next) => {
    if(req.file && req.filePath){
        const filePath = join(req.filePath, req.file.filename);
        try {
            await fs.unlink(filePath);
        } catch (error) {
            console.error('Error deleting file: ', error)
        }
    }
    if(err.status === 400 || err.errors){
        return res.status(400).json({
            sucess: false,
            error: err.errors
        });
    }

    return res.status(500).json({
        sucess: false,
        message: err.message
    })
}
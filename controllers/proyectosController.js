const Proyecto = require('../models/proyectoModel')
const { validationResult } = require('express-validator')

exports.crearProyecto = async (req,res) => {
    // revisar si hay errores
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            errores: errors.array()
        })
    }

    try {
        // Crear un nuevo proyecto
        const proyecto = new Proyecto(req.body);
        // Guardar al creador
        proyecto.creador = req.usuario.id;
        //Guardar en db
        await proyecto.save()
        res.json({
            proyecto
        })
    } catch (error) {
        // console.log(error);
        res.status(500).json({
            msg: 'hubo un error',
            error
        })
    }
}
// Obtener proyectos del usuario autenticado
exports.obtenerProyectos = async (req, res) =>{
    try {
        const proyectos = await Proyecto.find({creador: req.usuario.id}).sort({creado: -1});
        res.status(200).json({
            proyectos
        })
        
    } catch (error) {
        // console.log(error);
        res.status(500).json({
            msg: 'hubo un error',
            error
        })
    }
}

exports.actualizarProyecto = async (req,res) =>{
    // revisar si hay errores
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            errores: errors.array()
        })
    }
    // EXtraer la informacion del proyecto
    const { nombre } = req.body;
    const nuevoProyecto = {};
    if(nombre){
        nuevoProyecto.nombre = nombre
    }

    try {

        // Revisar si el proyecto existe o no
        await Proyecto.findById(req.params.id).then(async (proyecto)=>{
            if(!proyecto){
                return res.status(404).json({
                    msg: 'Proyecto no existe'
                })
            }
            // Verificar el creador del proyecto
            if(proyecto.creador.toString() !== req.usuario.id){
                return res.status(401).json({
                    msg: 'No autorizado'
                })
            }
            // Actualizar
            proyecto = await Proyecto.findOneAndUpdate({_id: req.params.id}, { $set: nuevoProyecto }, {new: true});
            res.status(200).json({
                proyecto
            })

        }).catch(e=>{
            return res.status(404).json({
                msg: 'Proyecto no encontrado'
            })
        })

    } catch (error) {
        // console.log(error);
        res.status(500).json({
            msg: 'hubo un error',
            error
        })
    }
}
exports.eliminarProyecto = (req,res) =>{

    try {
        Proyecto.findById(req.params.id).then(async (proyecto)=>{
            if(!proyecto){
                return res.status(404).json({
                    msg: 'Proyecto no existe'
                })
            }
            // Verificar el creador del proyecto
            if(proyecto.creador.toString() !== req.usuario.id){
                return res.status(401).json({
                    msg: 'No autorizado'
                })
            }
            // Eliminar el proyecto
            await Proyecto.findOneAndRemove({_id: req.params.id})
            res.status(200).json({
                msg: 'Proyecto eliminado'
            })

    
        }).catch(e=>{
            return res.status(404).json({
                msg: 'Proyecto no encontrado'
            })
        })
    } catch (error) {
        // console.log(error);
        res.status(500).json({
            msg: 'hubo un error',
            error
        })
    }

}
const Tarea = require('../models/tareaModel')
const Proyecto = require('../models/proyectoModel')
const { validationResult } = require('express-validator')

exports.crearTarea = async (req,res) => {
    // revisar si hay errores
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            errores: errors.array()
        })
    }
    
    try {
        // Extrar el proyecto y comprobar si existe
        const { proyecto } = req.body
        const existeProyecto = await Proyecto.findById(proyecto);
        if(!existeProyecto){
            return res.status(400).json({
                msg: 'Proyecto no encontrado'
            })
        }
        // Verificar el creador del proyecto
        if(existeProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({
                msg: 'No autorizado'
            })
        }
        // Creamos la tarea
        const tarea = Tarea(req.body)
        await tarea.save();
        res.status(200).json({
            msg: 'Tarea creada'
        })

        
    } catch (error) {
        // console.log(error);
        res.status(500).json({
            msg: 'hubo un error',
            error
        })
    }
}
exports.obtenerTareas = async (req,res) => {
    try {
        // Extrar el proyecto y comprobar si existe
        const { proyecto } = req.body
        const existeProyecto = await Proyecto.findById(proyecto);
        if(!existeProyecto){
            return res.status(400).json({
                msg: 'Proyecto no encontrado'
            })
        }
        // Verificar el creador del proyecto
        if(existeProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({
                msg: 'No autorizado'
            })
        }
        // Obtener las tareas por proyecto
        const tareas = await Tarea.find({ proyecto });
        res.status(401).json({
            tareas
        })

    } catch (error) {
        // console.log(error);
        res.status(500).json({
            msg: 'hubo un error',
            error
        })
    }
}

exports.actualizarTarea = async (req,res) => {
    try {
        // Extrar el proyecto y comprobar si existe
        const { proyecto, nombre, estado } = req.body
        console.log('estado: ',estado);
        // Revisar si la tarea existo o no
        let tarea = await Tarea.findById(req.params.id)
        if(!tarea){
            return res.status(400).json({
                msg: 'Tarea no encontrada'
            })
        }
        // Extraer proyecto
        const existeProyecto = await Proyecto.findById(proyecto);
        
        // Verificar el creador del proyecto
        if(existeProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({
                msg: 'No autorizado'
            })
        }
        // Crear un objeto con la nueva información
        const nuevaTarea = {};
        if(nombre) nuevaTarea.nombre = nombre
        if(estado !== undefined) {
            // console.log('sdfs');
            nuevaTarea.estado = estado
        } 
        console.log(nuevaTarea);
        
        // Guardar la tarea
        tarea = await Tarea.findOneAndUpdate({_id: req.params.id}, nuevaTarea, {new: true});
        res.status(200).json({
            tarea
        })
        
    } catch (error) {
        // console.log(error);
        res.status(500).json({
            msg: 'hubo un error',
            error
        })
    }
}

exports.eliminarTarea = async (req,res) => {
    try {
        // Extrar el proyecto y comprobar si existe
        const { proyecto } = req.body
        // Revisar si la tarea existo o no
        let tarea = await Tarea.findById(req.params.id)
        if(!tarea){
            return res.status(400).json({
                msg: 'Tarea no encontrada'
            })
        }
        // Extraer proyecto
        const existeProyecto = await Proyecto.findById(proyecto);
        
        // Verificar el creador del proyecto
        if(existeProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({
                msg: 'No autorizado'
            })
        }
        // Eliminar tarea
        await Tarea.findOneAndRemove({_id: req.params.id})
        
        res.status(200).json({
            msg: 'Tarea eliminada'
        })
        
    } catch (error) {
        // console.log(error);
        res.status(500).json({
            msg: 'hubo un error',
            error
        })
    }
}
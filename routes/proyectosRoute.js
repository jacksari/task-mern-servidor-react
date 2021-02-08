const express = require('express');
const router = express.Router();
const proyectosRoute = require('../controllers/proyectosController')
const authMiddleware = require('../middleware/authMiddleware')
const { check } = require('express-validator');

router.post('/',
    [
        check('nombre','El nombre es obligatorio').not().isEmpty(),  
    ],
    authMiddleware,
    proyectosRoute.crearProyecto
)
router.get('/',
    authMiddleware,
    proyectosRoute.obtenerProyectos
)
router.put('/:id',
    [
        check('nombre','El nombre es obligatorio').not().isEmpty(),  
    ],
    authMiddleware,
    proyectosRoute.actualizarProyecto
)
router.delete('/:id',
    authMiddleware,
    proyectosRoute.eliminarProyecto
)


module.exports = router;
const express = require('express');
const router = express.Router();
const tareasController = require('../controllers/tareasController')
const authMiddleware = require('../middleware/authMiddleware')
const { check } = require('express-validator');

router.post('/',
    [
        check('nombre','El nombre es obligatorio').not().isEmpty(),  
        check('proyecto','El proyecto es obligatorio').not().isEmpty(),  
    ],
    authMiddleware,
    tareasController.crearTarea
)

router.get('/',
    authMiddleware,
    tareasController.obtenerTareas
)

router.put('/:id',
    authMiddleware,
    tareasController.actualizarTarea
)

router.delete('/:id',
    authMiddleware,
    tareasController.eliminarTarea
)

module.exports = router;
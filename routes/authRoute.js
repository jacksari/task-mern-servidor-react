//Rutas para crear usuarios
const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { check } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');

//Crear usuario
router.post('/', 
    [
        check('email', 'Agrea un email válido').isEmail(),
    ],
    usuarioController.login
);

router.get('/',
    authMiddleware,
    usuarioController.usuarioAutenticado
)

module.exports = router;
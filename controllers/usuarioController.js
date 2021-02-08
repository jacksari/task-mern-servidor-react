const Usuario = require('../models/usuarioModel')
// Hash password
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { validationResult } = require('express-validator')
// JWT
const jwt = require('jsonwebtoken')

exports.crearUsuario = async ( req,res) => {
    // revisar si hay errores
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            errores: errors.array()
        })
    }

    // Extraer email y password
    const { email, password, nombre } = req.body

    try {
        //Revisar que el usuario sea único
        let usuario = await Usuario.findOne({email});
        if(usuario){
            return res.status(400).json({
                msg: 'El usuario ya existe'
            })
        }
        // Separar nombres
        let nom = nombre.split(' ')
        // Crear el usuario
        usuario = new Usuario(req.body);
        // agregar imagen
        usuario.img = `https://ui-avatars.com/api/?name=${nom[0]}+${nom[1] || 'H'}`;
        // Hass password
        const salt = bcrypt.genSaltSync(saltRounds);
        usuario.password = bcrypt.hashSync(password, salt);

        // guardar usuario
        const nuevoUsuario = await usuario.save();
        // Crear y firmar jwt
        const payload = {
            usuario: {
                id: nuevoUsuario.id,
                nombre: nuevoUsuario.nombre,
                email: nuevoUsuario.email,
                img: nuevoUsuario.img
            }
        }
        token = await jwt.sign(payload, process.env.SECRETA,{expiresIn: '3h'})
        res.status(200).json({
            token,
            msg: 'Usuario creado correctamente'
        })
    } catch (error) {
        console.log(error);
        res.status(400).send('Hubo un error')
    }    
}

exports.login = async ( req,res) => {
    // revisar si hay errores
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            errores: errors.array()
        })
    }
    // Extraer email y password
    const { email, password } = req.body;

    try {
        // Revisar que sea un usuario registrado
        let usuario = await Usuario.findOne({email})
        if(!usuario){
            return res.status(400).json({
                msg: 'El usuario no existe'
            })
        }
        // Si el email exite
        const passCorrecto = await bcrypt.compareSync(password, usuario.password)
        if(!passCorrecto){
            return res.status(400).json({
                msg: 'Datos incorrectos'
            })
        }
        // Si todo es correcto
        // Crear y firmar jwt
        const payload = {
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email,
                img: usuario.img
            }
        }
        token = await jwt.sign(payload, process.env.SECRETA,{expiresIn: '3h'})
        res.status(200).json({
            token
        })


    } catch (error) {
        console.log(e);
    }
}
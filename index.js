const express = require('express');
const conectarDB = require('./config/db')
const cors = require('cors')

//Crear el servidor
const app = express()

conectarDB()

//Habilitar cors
app.use(cors())

// Habilitar express.json
app.use(express.json({extended: true}));

// Puerto de la app
const port = process.env.PORT || 4000;

// Importar rutas
app.use('/api/usuarios', require('./routes/usuarioRoute'));
app.use('/api/auth', require('./routes/authRoute'));
app.use('/api/proyectos', require('./routes/proyectosRoute'));
app.use('/api/tareas', require('./routes/tareasRoute'));

app.listen(port, '0.0.0.0', () =>{
    console.log(`El servidor esta funcionando en el puerto ${port}`);
})




const express = require('express');
const conectarDB = require('./config/db')

//Crear el servidor
const app = express()

conectarDB()

// Puerto de la app
const PORT = process.env.PORT || 4000;

// Definir la página principal
app.get('/',(req,res)=>{
    res.send('Hola undo')
})

app.listen(PORT, () =>{
    console.log(`El servidor esta funcionando en el puerto ${PORT}`);
})



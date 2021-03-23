//framework de node js
const express = require('express');
///The Path modulo para trabajar con archivos y directorios
const path = require('path');

//Analice los cuerpos de las solicitudes entrantes en un middleware
const bodyParser = require('body-parser');

// Inicializaciones
const app = express();

/***************************************************/
// configuraciones generales
/***************************************************/

//Puerto
app.set('port', process.env.PORT || 4000);


// Middlewares
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// routes
app.use(require('./routes/ejemplo'));
app.use(require('./routes/ejemplo2'));

// carpeta public
app.use(express.static(path.join(__dirname, 'public')));

// inicializando
app.listen(app.get('port'), () => {
  console.log('Server is in port', app.get('port'));
});

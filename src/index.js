//framework de node js
const express = require('express');
/// morgan logger middleware
const morgan = require('morgan');
///The Path modulo para trabajar con archivos y directorios
const path = require('path');
//extesion para interpretar los archivos hbs
const exphbs = require('express-handlebars');
//manejo de sesiones con expres
const session = require('express-session');
//validadores de cadena
const validator = require('express-validator');
//manejod e sesione usando passport
const passport = require('passport');
//escritura de mensajes en flash para las sesiones
const flash = require('connect-flash');
//inicalizar la conexxion de la base de datos con la sesion
//const MySQLStore = require('express-mysql-session')(session);
//Conexion con POSTGRESQL
var PostgreSqlStore = require('connect-pg-simple')(session);

//Analice los cuerpos de las solicitudes entrantes en un middleware
const bodyParser = require('body-parser');
//Analizar el encabezado cokkie y completa req.cookies con un objeto codificado
var cookieParser = require('cookie-parser')

//inicializamos la conexion database
const { database } = require('./keys');

// Inicializaciones
const app = express();
//inicamos cookie parser
app.use(cookieParser());
//passport para el manejo de sesion
require('./lib/passport');

/***************************************************/
// configuraciones generales
/***************************************************/

//Puerto
app.set('port', process.env.PORT || 4000);
//directorio de vistas (no aplica)
app.set('views', path.join(__dirname, 'views'));
//configuracion del interprete de archivos *.hbs
app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  layoutsDir: path.join(app.get('views'), 'layouts'),
  partialsDir: path.join(app.get('views'), 'partials'),
  extname: '.hbs',
  helpers: require('./lib/handlebars')
}))
//interprete de archivos *.hbs
app.set('view engine', '.hbs');

// Middlewares
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//configuracion de cookie
app.use(cookieParser("CRM_enthous_local#"))

//configuracion de la sesion
app.use(session({
  secret: 'CRM_enthous_local#',
  resave: true,
  saveUninitialized: false,
  //postgres://USERNAME:PASSWORD@HOST_NAME:PORT/DB_NAME
  //store: new PostgreSqlStore('postgres://' + database.user + ':' + database.password + '@' + database.host + ':5432/' + database.database),
  //cookie: {domain: 'localhost:4000'}
}));
console.log('postgres://' + database.user + ':' + database.password + '@' + database.host + ':5432/' + database.database);
//paquete flash para mensajes en la sesion
app.use(flash());
//inicializacion de passport
app.use(passport.initialize());
//inicializacion de sesion en passport
app.use(passport.session());
app.use(validator());

//variables globales
app.use((req, res, next) => {
  app.locals.message = req.flash('message');
  app.locals.success = req.flash('success');
  app.locals.user = req.user;
  next();
});

// routes
app.use(require('./routes/index'));
/*app.use(require('./routes/authentication'));
app.use(require('./routes/cliente'));
app.use(require('./routes/agente'));
app.use(require('./routes/bundle'));
app.use(require('./routes/catalogo_categoria'));
app.use(require('./routes/catalogo_estado'));
app.use(require('./routes/catalogo_fabricante'));
app.use(require('./routes/catalogo_grupo'));
app.use(require('./routes/catalogo_tipo'));
app.use(require('./routes/catalogo_unidad'));
app.use(require('./routes/direccion'));
app.use(require('./routes/direccion_cliente'));
app.use(require('./routes/empresa'));
app.use(require('./routes/modulos'));
app.use(require('./routes/moneda'));
app.use(require('./routes/orden'));
app.use(require('./routes/orden_estado'));
app.use(require('./routes/orden_prioridad'));
app.use(require('./routes/pagos'));
app.use(require('./routes/pagos_estado'));
app.use(require('./routes/pagos_orden'));
app.use(require('./routes/pagos_prioridad'));
app.use(require('./routes/pagos_tipo'));
app.use(require('./routes/permisos'));
app.use(require('./routes/poliza'));
app.use(require('./routes/producto'));
app.use(require('./routes/prospecto'));
app.use(require('./routes/roles'));
app.use(require('./routes/servicio'));
app.use(require('./routes/submodulos'));
app.use(require('./routes/sucursal'));
app.use(require('./routes/territorio'));
app.use(require('./routes/usuario'));
app.use(require('./routes/wishlist'));*/
app.use(require('./routes/ejemplo'));
app.use(require('./routes/ejemplo2'));

// carpeta public
app.use(express.static(path.join(__dirname, 'public')));

// inicializando
app.listen(app.get('port'), () => {
  console.log('Server is in port', app.get('port'));
});

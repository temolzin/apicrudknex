//manejo de sesiones
const express = require('express');
//manejo de rutas
const router = express.Router();
//manejo de sesiones
const passport = require('passport');
//manejo de sesion
const jwt = require('jsonwebtoken');
//generador de cadenas aleatorias
const randomstring = require("randomstring");

//conexion con la base de datos
const pool = require('../database');
//modulo de encriptacion del password
const helpers = require('../lib/helpers'); 

const { isLoggedIn } = require('../lib/auth');

///login api directo con base de datos
/* router.post('/api/login', async (req, res) => {
  req.check('username', 'Username is Required').notEmpty();
  req.check('password', 'Password is Required').notEmpty();
  const errors = req.validationErrors();
  if(errors.length > 0 ){
    console.log(errors)
    return res.json(errors);
  }else{
    const { username, password } = req.body;
    const rows = await pool.query('SELECT * FROM users WHERE username = "'+ username + '"');
    if (rows.length > 0) {
      const user = rows[0];
      console.log('user: ' +  user.username)
      const validPassword = await helpers.matchPassword(password, user.password);
      if (validPassword) {
        console.log('success', 'Welcome ' + user.username);
        return res.json({ success: 'Welcome ' + user.username, code: '200', info: 'OK' });
      } else {
        console.log('message', 'Incorrect Password');
        return res.json({message: 'Incorrect Password', code: '401', info: 'Unauthorized'});
      }
    } else {
      return res.json({message: 'The Username does match', code: '403', info: 'Forbidden'});
    }
  }
}); */

///login api usando passport
router.post('/api/login', (req, res, next) => {
  const {username, password} = req.body;
  if (!username) {
    res.json( {message: 'Incorrect', code: '401', info: 'Unauthorized'} );
  }

  if (!password) {
    res.json( {message: 'Incorrect', code: '401', info: 'Unauthorized'} );
  }

  req.session.user = "";
  req.session.token = "";
  req.session.secret = ""
  req.logOut();

  const token = ''; 

  return passport.authenticate('local.signin', { session: false }, (err, passportUser, info) => {
    //console.log('apiiiiii: ',passportUser)
    if(err) {
      return next(err);
    }
    
    if(passportUser) {
      req.session.user = passportUser;
      console.log(passportUser)
      
      const secret = randomstring.generate( { length: 15, charset: 'alphabetic' } );
      
      req.session.secret = secret;
      ///token jwt
      //verificamos si existe un token de sesion 
      const token = jwt.sign( { user: passportUser } , secret );
      passportUser.token = token

      //no hay token de sesion asignado
      const result = pool.query('UPDATE users set ? WHERE id = ?', [passportUser, passportUser.id]);
      console.log(result)
      req.session.token = token;
        
      res.json( {message: 'success', code: '200', info: 'ok', user: passportUser} );
      
      //console.log(token)
    }else{
      res.json( {message: 'Incorrect', code: '400', info: 'Bad Request'} );
    }
  })(req, res, next); 
});

//obtener el usuario que esta logeado actualmente
router.get('/api/profile', isLoggedIn,  (req, res) => {
  return res.json({ message: 'success', code: '200', info: 'isLoggin', user: req.session.user })
});

//registrar un usuario
router.post('/api/register' ,  async (req, res) => {
  const { username, password, fullname } = req.body;

  if (!username) {
    res.json( {message: 'Incorrect', code: '401', info: 'Campos Requeridos'} );
  }

  if (!password) {
    res.json( {message: 'Incorrect', code: '401', info: 'Campos Requeridos'} );
  }

  if (!fullname) {
    res.json( {message: 'Incorrect', code: '401', info: 'Campos Requeridos'} );
  }
  
  let newUser = {
    fullname,
    username,
    password
  };
  //console.log(newUser)
  newUser.password = await helpers.encryptPassword(password);
  //console.log(newUser)
  const result = await pool.query('INSERT INTO users SET ? ', newUser);

  newUser.id = result.insertId;
  //console.log('id de insercion', result.insertId)
  if(result.affectedRows != 0){
    return res.json({ message: 'success', code: '200', info: 'Register', id: result.insertId })
  }else{
    res.json( {message: 'fail', code: '400', info: 'Bad Request'} );
  }
});

//cerrar sesion
router.get('/api/logout', (req, res) => {
  req.session.user = "";
  req.session.token = "";
  req.session.secret = ""
  req.logOut();
  res.json( {message: 'success', code: '200', info: 'logout'} );
});

//si la pagina no existe 
/* router.get('*', (req, res) => {
  res.json( {message: 'fail', code: '404', info: 'PageNotFound'} );
}); */

module.exports = router;

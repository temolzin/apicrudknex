const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const randomstring = require("randomstring");

/* const pool = require('../database');
const helpers = require('../lib/helpers'); */

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

  return passport.authenticate('local.signin', { session: false }, (err, passportUser, info) => {
    //console.log('apiiiiii: ',passportUser)
    if(err) {
      return next(err);
    }
    
    if(passportUser) {
      req.session.user = passportUser;
      //console.log(passportUser)
      
      ///token jwt
      const secret = randomstring.generate({
        length: 12,
        charset: 'alphabetic'
      });

      req.session.secret = secret;
      
      const token = jwt.sign({
        user: passportUser
      },
        secret
      )

      req.session.token = token;
      //console.log(token)
      res.json( {message: 'success', code: '200', info: 'ok', user: passportUser, token: token} );
    }else{
      res.json( {message: 'Incorrect', code: '400', info: 'Bad Request'} );
    }
  })(req, res, next); 
});

//el usuario que esta logeado actualmente
router.get('/api/profile', isLoggedIn,  (req, res) => {
  ///api jwt
  var token = req.headers['authorization']
  if(!token){
    return res.json( {message: 'fail', code: '404', info: 'NotFound'} );
  }
  token = token.replace('Bearer ', '')
  /* console.log('token header: ',token)
  console.log('token sesion: ',req.session.token) */

  //verificamos si el token de la sesion actual corresponde con el del encabezado de la peticion
  if(req.session.token == token){
    jwt.verify(token, req.session.secret , function(err, decoded) {
      //console.log('data: ',err , decoded.user) // bar
      if (err) {
        return res.json( {message: 'fail', code: '401', info: 'Token invalid'} ); 
      } else {
        return res.json({ message: 'success', code: '200', info: 'isloggein', user: decoded.user })
      }
    });
  }else{
    return res.json( {message: 'fail', code: '401', info: 'Token Header invalid'} ); 
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
router.get('*', (req, res) => {
  res.json( {message: 'fail', code: '404', info: 'PageNotFound'} );
});

module.exports = router;

//manejo de sesion
const jwt = require('jsonwebtoken');
//conexion con la base de datos
const pool = require('../database');

//validacion del logueo del usuario
module.exports = {
    async isLoggedIn (req, res, next) {
        if( (req.session.token != "") && (req.session.user != "") ){
            var token = req.headers['authorization']
            if(!token){
                return res.json( {message: 'fail', code: '404', info: 'NotFound'} );
            }
            token = token.replace('Bearer ', '')
            //verificamos si token de header es igual al de sql
            const rows = pool.query('SELECT * FROM users WHERE id = "'+ req.session.user.id + '"');
            //console.log('usuario logeado: ',rows[0])
            if(req.session.token == rows[0].token){
                //console.log('token header auth.js: ',token)
                //verificamos si el token de la sesion actual corresponde con el del encabezado de la peticion
                if(req.session.token == token){
                    //verificamos si no ha expirado el token
                    jwt.verify(token, req.session.secret , function(err, decoded) {
                        if (err) {
                            return res.json( {message: 'fail', code: '401', info: 'Token Expired'} ); 
                        } else {
                            //return res.json({ message: 'success', code: '200', info: 'isloggein', user: decoded.user })
                            return next();
                        }
                    });
                }else{
                    return res.json( {message: 'fail', code: '401', info: 'Token Header is Invalid'} ); 
                }
            }else{
                return res.json( {message: 'fail', code: '401', info: 'Sesion Token is Invalid'} );
            }
        }else{
            return res.json( {message: 'fail', code: '401', info: 'Sesion Token is Null'} ); 
        }
    }
};

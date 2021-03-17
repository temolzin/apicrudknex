//manejo de sesion
const jwt = require('jsonwebtoken');

//validacion del logueo del usuario
module.exports = {
    isLoggedIn (req, res, next) {        
        if( (req.session.token != "") && (req.session.user != "") ){

            var token = req.headers['authorization']
            if(!token){
                return res.json( {message: 'fail', code: '404', info: 'NotFound'} );
            }
            token = token.replace('Bearer ', '')
            //console.log('token header auth.js: ',token)
            //verificamos si el token de la sesion actual corresponde con el del encabezado de la peticion
            if(req.session.token == token){
                jwt.verify(token, req.session.secret , function(err, decoded) {
                //console.log('data: ',err , decoded.user) // bar
                    if (err) {
                        return res.json( {message: 'fail', code: '401', info: 'Token invalid'} ); 
                    } else {
                        //return res.json({ message: 'success', code: '200', info: 'isloggein', user: decoded.user })
                        return next();
                    }
                });
            }else{
                return res.json( {message: 'fail', code: '401', info: 'Token Header invalid'} ); 
            }
        }

    }
};
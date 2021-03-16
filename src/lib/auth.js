const jwt = require('jsonwebtoken');

//validacion del logueo del usuario
module.exports = {
    isLoggedIn (req, res, next) {
        //console.log('is Authenticated: ' + req.isAuthenticated)
        
        if(req.session.token != ""){
            return next();
        }
        
        return res.json( {message: 'fail', code: '404', info: 'Unauthorized'} );
    }
};
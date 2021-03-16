//modulo passport
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

//llamado a archivo database
const pool = require('../database');
//llamado a archivo helpers para la contraseña 
const helpers = require('./helpers');

//metodo para incio de ssesion con pasport 
passport.use('local.signin', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
}, async (username, password, done) => {
  //console.log('username passport: ',username)
  const rows = await pool.query('SELECT * FROM users WHERE username = "'+ username + '"');
  //console.log('rows: ',rows)
  if(rows.length > 0){
    const user = rows[0];
    //console.log('passport user: ',user);
    const validPassword = await helpers.matchPassword(password, user.password);
    if (validPassword) {
      return done(null, user, {success: { 'Welcome ' : user.username} });
    } else {
      return done(null, false, { errors: { 'email or password': 'is invalid' } });
    }
  }else{
    return done(null, false, { errors: { 'email or password': 'is invalid' } });
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const rows = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
  done(null, rows[0]);
});
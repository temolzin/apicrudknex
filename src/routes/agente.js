const db = require('../utils/utildb');
const table = 'agente';
const arrayinsert = ["id", "username", "fullname"];
const arrayupdate = ["username", "fullname"];

db.read(table);
db.readbyid(table);
db.insert(table, arrayinsert);
db.update(table, arrayupdate);
db.delete(table);

module.exports = db.app;

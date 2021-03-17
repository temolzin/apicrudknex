const db = require('../utils/utildb');
const table = 'direccion_cliente';
const arrayinsert = ["id", "name"];
const arrayupdate = ["name"];

db.read(table);
db.readbyid(table);
db.insert(table, arrayinsert);
db.update(table, arrayupdate);
db.delete(table);

module.exports = db.app;

const db = require('../utils/utildb');
const table = 'ejemplo2';
const arrayinsert = ["id_ejemplo2", "nombre"];
const arrayupdate = ["nombre"];

db.read(table);
db.readbyid(table);
db.insert(table, arrayinsert);
db.update(table, arrayupdate);
db.delete(table);

module.exports = db.app;

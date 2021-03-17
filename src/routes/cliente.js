const db = require('../utils/utildb');
const table = 'cliente';
const arrayinsert = ["id", "name"];
const arrayupdate = ["name"];

db.read(table);
db.readbyid(table);
db.insert(table, arrayinsert);
db.update(table, arrayupdate);
db.delete(table);

module.exports = db.app;

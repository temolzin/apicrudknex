const db = require('../utils/utildb');
const table = 'cliente';
//db.checkConection();
db.read(table);
const arrayinsert = ["id", "name"];
db.insert(table, arrayinsert);

module.exports = db.app;

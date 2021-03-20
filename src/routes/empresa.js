const db = require('../utils/utildb');
const table = 'empresa';
const arrayinsert = ["id_empresa", "id_pais", "nombre", "razon_social", "direccion_matriz", "correo_principal", "sitio_web", "telefono", "logo", "zona_horaria", "activo"];
const arrayupdate = ["id_pais", "nombre", "razon_social", "direccion_matriz", "correo_principal", "sitio_web", "telefono", "logo", "zona_horaria", "activo"];

db.read(table);
db.readbyid(table);
db.insert(table, arrayinsert);
db.update(table, arrayupdate);
db.delete(table);

module.exports = db.app;

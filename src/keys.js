//conexion con la base de datos
module.exports = {
    database: {
        //limite de conexiones
        connectionLimit: 10,
        host: 'localhost',
        user: 'postgres',
        password: 'root',
        database: 'klanetcrm',
        port: 5432,
    }
};

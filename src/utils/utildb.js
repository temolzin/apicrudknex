const express = require('express');
const app = express.Router();
const knex = require('../database');

// Route


/*
router.post('/ejemplo/insert', (req, res) => {

});

router.put('/ejemplo/update/:id', (req, res) => {
    const { id } = req.params;
    const { nombre } = req.body;
    knex.table('ejemplo').where({ id: id }).update({ nombre: nombre }).then(function (result) {
        res.end('Registro actualizado');
    });
});

router.delete('/ejemplo/delete/:id', (req, res) => {
    const { id } = req.params;
    knex( "ejemplo" ).del().where( "id", id).then(function (result) {
        res.end('Registro eliminado exitosamente');
    });
});

module.exports = router;*/

//*****************************************************

module.exports = {
    app,
    read(table) {
        app.get('/' + table + '/read', (req, res) => {
            knex.select('*').from(table).then(function (result) {
                res.json(result);
            });
        })
    },


    /**
     * Metodo par obtener un registro
     * @param table nombre de la tabla
     */
    readbyid(table) {
        app.get('/' + table + '/read/:id', (req, res) => {
            const { id } = req.params;
            knex.select('*').from(table).where('id_' + table, id).then(function (meals) {
                res.json(meals);
            });
        });
    },

    /**
     * Metodo para crear el endpoint para registrar
     * @param table nombre de la tabla
     * @param arrayinsert Arreglo con los datos para insertar
     * ejemplo: const arreglo = {'name', 'password'}
     */
    insert(table, arrayinsert) {
        app.post('/' + table + '/insert', (req, res) => {
            let objInsert = {};
            arrayinsert.forEach(function (item, index) {
                objInsert[item] = req.body[item];           //console.log(req.body[item]);
            });
            knex(table).insert(objInsert).returning('id_' + table).then(function (result) {
                console.log(result);
                res.end('Registro exitoso en ' + table + ', ID Insertado: ' + result);
            });

        });
    },

    /**
     * Metodo para crear el endpoint para actualizar
     * @param table nombre de la tabla
     * @param arrayupdate Arreglo con los datos para actualizar
     * ejemplo: const arreglo = {'name', 'password'}
     */
    update(table, arrayupdate) {
        app.put('/' + table + '/update/:id', (req, res) => {
            const { id } = req.params;
            let arr = {};
            arrayupdate.forEach(function (item, index) {
                arr[item] = req.body[item];
            });

            knex.table(table).update(arr).where('id_' + table, id).then(function (result) {
                res.end('Registro de ' + table + ' actualizado exitosamente');
            });
        });
    },

    /**
     * Metodo para crear el endpoint para eliminar
     * @param table nombre de la tabla
     */
    delete(table) {
        app.delete('/' + table + '/delete/:id', (req, res) => {
            const { id } = req.params;
            knex( table ).del().where( "id_" + table, id).then(function (result) {
                res.end('Registro de ' + table + ' eliminado exitosamente');
            });
        });
    },
}

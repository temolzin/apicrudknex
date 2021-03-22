const express = require('express');
const router = express.Router();

const knex = require('knex')({
    client: 'pg',
    connection: {
        host : 'localhost',
        user : 'postgres',
        password : 'root',
        database : 'klanetcrm'
    }
});

// Route
router.get('/ejemplo', (req, res) => {
    res.send('Welcome to my API!');
});

router.get('/ejemplo/read', (req, res) => {
    knex.select('*').from('ejemplo').then(function (meals) {
        res.json(meals);
    });
});

router.get('/ejemplo/read/:id', (req, res) => {
    const { id } = req.params;
    knex.select('*').from('ejemplo').where('id', id).then(function (meals) {
            res.json(meals);
    });
});

router.post('/ejemplo/insert', (req, res) => {
    const customerObj = {
        id: req.body.id,
        nombre : req.body.nombre
    };
    knex('ejemplo').insert({id: customerObj.id, nombre: customerObj.nombre}).returning('id').then(function (result) {
        console.log(result);
        res.end('Registro exitoso, ID Insertado: ' + result);
    });
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

module.exports = router;

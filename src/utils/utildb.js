const express = require('express');
const mysql = require('mysql');

const app = express.Router();

// MySql
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'db_links'
});

module.exports = {
    app,

    checkConection(){
        connection.connect(error => {
            if (error) throw error;
            console.log('Database server running!');
        });
    },
    
    read(table) {
        app.get('/cliente/read', (req, res) => {
            const sql = 'SELECT * FROM ' + table;
    
            connection.query(sql, (error, results) => {
                if (error) throw error;
                if (results.length > 0) {
                    res.json(results);
                } else {
                    res.send('Not result');
                }
            });
        });
    },
    
     readbyid(table) {
        app.get('/' + table + '/read/:id', (req, res) => {
            const { id } = req.params;
            const sql = `SELECT * FROM ' + table + ' WHERE id = ${id}`;
            connection.query(sql, (error, result) => {
                if (error) throw error;
    
                if (result.length > 0) {
                    res.json(result);
                } else {
                    res.send('Not result');
                }
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
        app.post('/' + table + '/add', (req, res) => {
            const sql = 'INSERT INTO ' + table + ' SET ?';
            let objInsert = {};
            arrayinsert.forEach(function (item, index) {
                console.log(req.body[item]);
                objInsert[item] = req.body[item];
            });

            connection.query(sql, objInsert, error => {
                if (error) throw error;
                res.end('Customer created!');
            });
        });
    }
}

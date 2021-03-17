const express = require('express');
const mysql = require('mysql');

const app = express.Router();

const connection = require('../database');

const { isLoggedIn } = require('../lib/auth')

module.exports = {
    app,
    read(table) {
        app.get('/' + table + '/read', isLoggedIn, (req, res) => {
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
        app.get('/' + table + '/read/:id', isLoggedIn, (req, res) => {
            const { id } = req.params;
            const sql = `SELECT * FROM  ${table}  WHERE id = ${id}`;
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
        app.post('/' + table + '/insert', isLoggedIn, (req, res) => {
            const sql = 'INSERT INTO ' + table + ' SET ?';
            let objInsert = {};
            arrayinsert.forEach(function (item, index) {
                console.log(req.body[item]);
                objInsert[item] = req.body[item];
            });

            connection.query(sql, objInsert, error => {
                if (error) throw error;
                res.end('Insert ' + table + ' successfully');
            });
        });
    },

    update(table, arrayupdate) {
        app.put('/' + table + '/update/:id', isLoggedIn, (req, res) => {
            const { id } = req.params;
            let sqlUpdate = `UPDATE ` + table +  ` SET `;
            let cadenaUpdate = "";

            arrayupdate.forEach(function (item, index) {
                console.log("ITEM" + item);
                cadenaUpdate += item + ' = ' + `'` + req.body[item] + `'` + ' ';
            });

            sqlUpdate +=  cadenaUpdate + ` WHERE id =${id}`;
            console.log(sqlUpdate);
            connection.query(sqlUpdate, error => {
                if (error) throw error;
                res.end('Update ' + table + ' successfully');
            });
        });
    },

    delete(table) {
        app.delete('/' + table + '/delete/:id', isLoggedIn, (req, res) => {
            const { id } = req.params;
            const sql = `DELETE FROM ` + table + ` WHERE id = ${id}`;

            connection.query(sql, error => {
                if (error) throw error;
                res.end('Delete ' + table + ' successfully');
            });
        });
    },
}
